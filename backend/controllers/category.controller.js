import pool from "../db.js";

export const addCategory = async (req, res) => {
  try {
    const { category_name, category_desc } = req.body;
    const imagePath = req.file ? `/uploads/category-images/${req.file.filename}` : null;

    if (!category_name || !category_desc) {
      return res.status(400).json({ message: "Category name and description are required" });
    }

    if (category_name.trim().length < 3) {
      return res.status(400).json({ message: "Category name must be at least 3 characters long" });
    }

    if (!imagePath) {
      return res.status(400).json({ message: "Category image is required" });
    }

    await pool.query(
      "INSERT INTO categories (category_name, category_desc, image) VALUES (?, ?, ?)",
      [category_name.trim(), category_desc.trim(), imagePath]
    );

    res.status(201).json({
      message: "Category added successfully ✅",
      imageUrl: `http://localhost:5000${imagePath}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ message: "Page and limit must be positive numbers" });
    }

    const offset = (page - 1) * limit;

    const [countResult] = await pool.query("SELECT COUNT(*) AS total FROM categories");
    const total = countResult[0].total;

    const [rows] = await pool.query(
      "SELECT * FROM categories ORDER BY category_name ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const [rows] = await pool.query(
      "SELECT category_id, category_name, category_desc, image FROM categories WHERE category_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

