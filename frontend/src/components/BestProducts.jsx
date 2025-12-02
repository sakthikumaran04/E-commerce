import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from './ui/card';
import { Link } from 'react-router-dom';
import { exampleImage } from '@/utils/images';

function BestProducts({ categoryId }) {
    const limit = 3;
    const [categoryName, setCategoryName] = useState("");
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // ref to the section so we can scroll to it
    const sectionRef = useRef(null);

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

    // When loading finishes (i.e., products updated), scroll the section into view
    useEffect(() => {
        if (!loading && sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [loading]); // triggers when loading changes to false

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // we do NOT scroll here — we wait for loading to finish (see effect above)
        }
    };

    return (
        <section ref={sectionRef} className='my-10'>
            <h2 className="text-2xl font-semibold mb-4">Best on {categoryName}</h2>
            {loading ? (
                <p className="text-gray-500 min-h-[200px]">Loading...</p>
            ) : (
                <>
                    {products.length === 0 ? (
                        <p>No products found in this category.</p>
                    ) : (
                        // give the grid a min height to reduce layout jumps (optional)
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
                            {products.map((product) => (
                                <Link key={product.product_id} to={`/product/${product.product_id}`}>
                                    <Card
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
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            onMouseDown={(e) => e.preventDefault()} // prevent focus jump on click
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            onMouseDown={(e) => e.preventDefault()} // prevent focus jump on click
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </section>
    )
}

export default BestProducts;
