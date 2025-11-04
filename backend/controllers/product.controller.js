import pool from "../db.js";
import multer from "multer";
import client from "../configs/elasticsearch.config.js";
import fs from "fs";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/product-images";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
        cb(null, uniqueName);
    },
});

export const upload = multer({ storage });

export const addProduct = async (req, res) => {
  try {
    const { name, MRP_in_INR, discount_price, qty, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !MRP_in_INR || !discount_price || !qty || !category_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (name.trim().length < 3) {
      return res.status(400).json({ message: "Product name must be at least 3 characters long" });
    }

    if (isNaN(MRP_in_INR) || MRP_in_INR <= 0) {
      return res.status(400).json({ message: "Invalid MRP value" });
    }

    if (isNaN(discount_price) || discount_price <= 0) {
      return res.status(400).json({ message: "Invalid discount price" });
    }

    if (parseFloat(discount_price) > parseFloat(MRP_in_INR)) {
      return res.status(400).json({ message: "Discount price cannot exceed MRP" });
    }

    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    if (isNaN(category_id) || category_id <= 0) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    if (!image) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const [categoryExists] = await pool.query(
      "SELECT category_name, category_desc FROM categories WHERE category_id = ?",
      [category_id]
    );

    if (categoryExists.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const [result] = await pool.query(
      "INSERT INTO products (name, MRP_in_INR, discount_price, qty, image, category_id) VALUES (?, ?, ?, ?, ?, ?)",
      [name.trim(), MRP_in_INR, discount_price, qty, image, category_id]
    );

    const productId = result.insertId;
    const category = categoryExists[0];

    await client.index({
      index: "products",
      id: productId.toString(),
      document: {
        product_id: productId,
        name,
        MRP_in_INR: parseFloat(MRP_in_INR),
        discount_price: parseFloat(discount_price),
        qty: parseInt(qty),
        image,
        category_name: category.category_name,
        category_description: category.category_desc,
      },
    });

    res.status(201).json({
      message: "Product added successfully ✅",
      product_id: productId,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ message: "Page and limit must be positive numbers" });
    }

    if (categoryId && (isNaN(categoryId) || categoryId <= 0)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const offset = (page - 1) * limit;
    let countQuery = "SELECT COUNT(*) AS total FROM products";
    let dataQuery = "SELECT * FROM products";
    const params = [];

    if (categoryId) {
      countQuery += " WHERE category_id = ?";
      dataQuery += " WHERE category_id = ?";
      params.push(categoryId);
    }

    dataQuery += " ORDER BY name ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [countResult] = await pool.query(countQuery, categoryId ? [categoryId] : []);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const [rows] = await pool.query(dataQuery, params);

    const products = rows.map((p) => ({
      ...p,
      image: p.image ? `http://localhost:5000/uploads/product-images/${p.image}` : null,
    }));

    res.json({
      currentPage: page,
      totalPages,
      totalItems,
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const [rows] = await pool.query(
      `SELECT 
        p.product_id,
        p.name,
        p.MRP_in_INR,
        p.discount_price,
        p.qty,
        p.image,
        c.category_id,
        c.category_name,
        c.category_desc
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = rows[0];

    const formattedProduct = {
      product_id: product.product_id,
      name: product.name,
      MRP_in_INR: product.MRP_in_INR,
      discount_price: product.discount_price,
      qty: product.qty,
      image: product.image
        ? `http://localhost:5000/uploads/product-images/${product.image}`
        : null,
      category: {
        id: product.category_id,
        name: product.category_name,
        description: product.category_desc,
      },
    };

    res.json(formattedProduct);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
};





