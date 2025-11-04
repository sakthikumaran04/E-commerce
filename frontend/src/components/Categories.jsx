import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/categories?page=${page}&limit=${limit}`,
          {
            withCredentials: true, // 👈 ensures cookies (like token) are sent
          }
        );
        setCategories(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <section className="my-10">
      <h2 className="text-2xl font-semibold mb-4">Categories</h2>

      {/* Category Cards */}
      <div className="grid grid-cols-4 gap-6 cursor-pointer">
        {categories.map((cat) => (
          <Link to={`/category/${cat.category_id}`}
            key={cat.category_id}
            className="border rounded-2xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <img
              src={`http://localhost:5000${cat.image}`}
              alt={cat.category_name}
              className="w-16 h-16 object-contain mb-3"
            />
            <h3 className="text-md font-semibold">{cat.category_name}</h3>
            <p className="text-gray-600 text-sm mt-2">{cat.category_desc}</p>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default Categories;
