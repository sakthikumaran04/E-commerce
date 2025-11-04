import pool from "../db.js";
import client from "../configs/elasticsearch.config.js";



const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const UPLOAD_PATH = process.env.UPLOAD_PATH || "/uploads/product-images/";
const fullImagePath = (img) => `${BASE_URL}${UPLOAD_PATH}${img}`;

function parsePriceFilter(query) {
  const str = query.toLowerCase();

  const under = str.match(/under\s*(\d+)/) || str.match(/below\s*(\d+)/);
  if (under) return { max: +under[1] };

  const above = str.match(/above\s*(\d+)/) || str.match(/over\s*(\d+)/);
  if (above) return { min: +above[1] };

  const between = str.match(/between\s*(\d+)\s*(and|-)\s*(\d+)/);
  if (between) return { min: +between[1], max: +between[3] };

  return null;
}

function cleanQuery(query) {
  return query
    .replace(/(under|below|above|over|between|and|-|\d+)/gi, "")
    .trim();
}

export const simpleSearch = async (req, res) => {
  try {
    let { q, page = 1, limit = 10, sort = "relevance" } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const priceFilter = parsePriceFilter(q);
    const cleanedQuery = cleanQuery(q);

    const offset = (page - 1) * limit;
    const orderBy =
      sort === "asc"
        ? "ORDER BY discount_price ASC"
        : sort === "desc"
          ? "ORDER BY discount_price DESC"
          : "";

    let whereClause = "WHERE name LIKE ?";
    const params = [`%${cleanedQuery}%`];

    if (priceFilter) {
      if (priceFilter.min && priceFilter.max) {
        whereClause += " AND discount_price BETWEEN ? AND ?";
        params.push(priceFilter.min, priceFilter.max);
      } else if (priceFilter.max) {
        whereClause += " AND discount_price <= ?";
        params.push(priceFilter.max);
      } else if (priceFilter.min) {
        whereClause += " AND discount_price >= ?";
        params.push(priceFilter.min);
      }
    }

    const [rows] = await pool.query(
      `SELECT * FROM products ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
      [...params, +limit, +offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM products ${whereClause}`,
      params
    );

    const results = rows.map((p) => ({
      ...p,
      image: fullImagePath(p.image),
    }));

    res.json({
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
      sort,
      results,
    });
  } catch (err) {
    console.error("❌ Error in simpleSearch:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const elasticSearch = async (req, res) => {
  try {
    let { q, page = 1, limit = 10, sort = "relevance" } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const priceFilter = parsePriceFilter(q);
    const cleanedQuery = cleanQuery(q);
    const from = (page - 1) * limit;

    const sortOption =
      sort === "asc"
        ? [{ discount_price: { order: "asc" } }]
        : sort === "desc"
          ? [{ discount_price: { order: "desc" } }]
          : [];

    const mustFilters = [];

    if (priceFilter) {
      const range = {};
      if (priceFilter.min && priceFilter.max)
        range.discount_price = { gte: priceFilter.min, lte: priceFilter.max };
      else if (priceFilter.min)
        range.discount_price = { gte: priceFilter.min };
      else if (priceFilter.max)
        range.discount_price = { lte: priceFilter.max };

      mustFilters.push({ range });
    }

    const result = await client.search({
      index: "products",
      from,
      size: limit,
      sort: sortOption,
      query: {
        bool: {
          must: mustFilters,
          should: [
            {
              multi_match: {
                query: cleanedQuery,
                fields: ["name^4", "category_name^2", "category_description"],
                fuzziness: "AUTO",
                operator: "or",
              },
            },
            {
              multi_match: {
                query: cleanedQuery,
                fields: ["name^3", "category_name^2", "category_description"],
                type: "bool_prefix",
              },
            },
            {
              match_phrase_prefix: {
                name: {
                  query: cleanedQuery,
                  slop: 3,
                  boost: 2,
                },
              },
            },
            {
              wildcard: {
                name: {
                  value: `*${cleanedQuery.toLowerCase()}*`,
                  boost: 0.2,
                },
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
    });

    const hits = result.hits.hits.map((h) => {
      const src = h._source;
      return {
        product_id: src.product_id,
        name: src.name,
        MRP_in_INR: src.MRP_in_INR,
        discount_price: src.discount_price,
        qty: src.qty,
        image: fullImagePath(src.image),
        category_name: src.category_name,
        category_description: src.category_description,
      };
    });

    res.json({
      total: result.hits.total.value,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(result.hits.total.value / limit),
      sort,
      results: hits,
    });
  } catch (err) {
    console.error("❌ Error in elasticSearch:", err);
    res.status(500).json({ message: "Server error" });
  }
};
