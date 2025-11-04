import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exampleImage } from "@/utils/images";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 3;

  // ✅ Read current page from URL (?page=2)
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  // ✅ Keep URL and state in sync
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  // ✅ Fetch category name
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/categories/${categoryId}`,
          { withCredentials: true }
        );
        setCategoryName(res.data.category_name);
      } catch (error) {
        console.error("Error fetching category name:", error);
      }
    };
    if (categoryId) fetchCategoryName();
  }, [categoryId]);

  // ✅ Fetch products for this category and page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/products?category_id=${categoryId}&limit=${limit}&page=${currentPage}`,
          { withCredentials: true }
        );
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) fetchProducts();
  }, [categoryId, currentPage]);

  // ✅ Handle pagination and update URL
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setSearchParams({ page: String(page) });
      window.scrollTo({
        top:0,
        behavior:"smooth"
      })
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {categoryName
          ? `Products in ${categoryName}`
          : `Products in Category ${categoryId}`}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <>
          {/* ✅ Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link to={`/product/${product.product_id}`} key={product.product_id}>
                <Card className="shadow-md hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-4 flex flex-col h-full">
                    <img
                      src={exampleImage}
                      alt={product.name}
                      className="w-full h-48 object-contain mb-4"
                    />
                    <h3 className="text-lg font-medium line-clamp-3">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      <p className="text-gray-600 line-through text-sm">
                        ₹{product.MRP_in_INR}
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{product.discount_price}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {product.qty} | ID: {product.product_id}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-center items-center mt-10 space-x-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>

            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>

        </>
      )}
    </div>
  );
};

export default CategoryProducts;
