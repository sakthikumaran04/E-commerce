import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { exampleImage } from "@/utils/images";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const limit = 6;
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/products?page=${page}&limit=${limit}`,
          { withCredentials: true }
        );
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  // Handle pagination navigation (updates URL)
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
      navigate(`/allproducts?page=${newPage}`);
      window.scrollTo({
        top:0,
        behavior:"smooth"
      })
    }
  };

  return (
    <section className="px-32 py-10">
      <h2 className="text-3xl font-semibold mb-6 text-blue-600">All Products</h2>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.product_id} to={`/product/${product.product_id}`}>
              <Card
                key={product.product_id}
                className="shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-4">
                  <img
                    src={exampleImage}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h3 className="text-lg font-medium line-clamp-2">{product.name}</h3>
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
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 space-x-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
        >
          Previous
        </Button>
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  );
}

export default AllProducts;
