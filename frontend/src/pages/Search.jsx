import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { exampleImage } from "@/utils/images";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("query") || "";
  const mode = params.get("mode") || "simple";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const limit = 3;

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");

      const baseUrl =
        mode === "elastic"
          ? "http://localhost:5000/api/search/elastic"
          : "http://localhost:5000/api/search/simple";

      const url = `${baseUrl}?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`;

      const res = await axios.get(url, { withCredentials: true });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Error loading results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, mode, page]);

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (data && page < data.totalPages) setPage((p) => p + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Search Results for "<span className="text-blue-600">{query}</span>"{" "}
          ({mode === "elastic" ? "Elasticsearch" : "Simple Search"})
        </h1>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && data && data.results.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}

        {!loading && data && data.results.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {data.results.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
                >
                  <img
                    src={exampleImage}
                    alt={item.name}
                    className="w-full h-48 object-contain mb-3 rounded-lg bg-gray-100"
                  />
                  <h3 className="font-semibold text-gray-800 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.category_name}
                  </p>
                  <div className="mt-auto">
                    <p className="text-gray-600 line-through text-sm">
                      ₹{item.MRP_in_INR}
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{item.discount_price}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.qty} | ID: {item.product_id}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page === data.totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
