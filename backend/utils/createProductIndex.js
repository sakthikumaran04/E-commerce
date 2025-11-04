// utils/createProductIndex.js
import client from "../configs/elasticsearch.config.js";

async function createProductIndex() {
  const indexName = "products";

  try {
    // delete if exists (safe for dev)
    const exists = await client.indices.exists({ index: indexName });
    if (exists) {
      await client.indices.delete({ index: indexName });
      console.log("🗑️ Deleted old 'products' index");
    }

    await client.indices.create({
      index: indexName,
      body: {
        settings: {
          analysis: {
            analyzer: {
              product_autocomplete: {
                tokenizer: "product_edge_ngram_tokenizer",
                filter: ["lowercase", "asciifolding"]
              },
              product_search_analyzer: {
                tokenizer: "standard",
                filter: ["lowercase", "asciifolding"]
              }
            },
            tokenizer: {
              product_edge_ngram_tokenizer: {
                type: "edge_ngram",
                min_gram: 2,
                max_gram: 20,
                token_chars: ["letter", "digit"]
              }
            }
          }
        },
        mappings: {
          properties: {
            product_id: { type: "integer" },
            name: {
              type: "text",
              analyzer: "product_autocomplete",
              search_analyzer: "product_search_analyzer",
              fields: { raw: { type: "keyword" } }
            },
            category_name: {
              type: "text",
              analyzer: "product_autocomplete",
              search_analyzer: "product_search_analyzer",
              fields: { raw: { type: "keyword" } }
            },
            category_description: {
              type: "text",
              analyzer: "product_search_analyzer"
            },
            MRP_in_INR: { type: "float" },
            discount_price: { type: "float" },
            qty: { type: "integer" },
            image: { type: "keyword" }
          }
        }
      }
    });

    console.log("✅ Product index created with edge_ngram analyzer (autocomplete + partial)");
  } catch (err) {
    console.error("❌ Error creating product index:", err);
    process.exit(1);
  }
}

createProductIndex().then(() => process.exit(0));
