// utils/syncProductsToES.js
import client from "../configs/elasticsearch.config.js";
import pool from "../db.js";

const INDEX = "products";
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const UPLOAD_PATH = process.env.UPLOAD_PATH || "/uploads/product-images/";
const fullImagePath = (img) => (img ? `${BASE_URL}${UPLOAD_PATH}${img}` : null);

async function syncProducts() {
  try {
    // fetch products joined with categories
    const [rows] = await pool.query(`
      SELECT p.*, c.category_name, c.category_desc
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
    `);

    if (!rows.length) {
      console.log("ℹ️ No products found in MySQL to sync.");
      return;
    }

    // build bulk payload
    const body = [];
    for (const p of rows) {
      body.push({ index: { _index: INDEX, _id: p.product_id.toString() } });
      body.push({
        product_id: p.product_id,
        name: p.name,
        MRP_in_INR: parseFloat(p.MRP_in_INR) || 0,
        discount_price: parseFloat(p.discount_price) || 0,
        qty: parseInt(p.qty) || 0,
        image: p.image || null,
        category_name: p.category_name || null,
        category_description: p.category_desc || null
      });
    }

    const resp = await client.bulk({ refresh: true, body });
    if (resp.errors) {
      // print first error for debugging
      const firstError = resp.items.find((i) => i.index && i.index.error);
      console.error("Bulk index had errors:", firstError);
    } else {
      console.log(`✅ Synced ${rows.length} products to Elasticsearch`);
    }

  } catch (err) {
    console.error("❌ Error syncing products:", err);
    process.exit(1);
  }
}

syncProducts().then(() => process.exit(0));
