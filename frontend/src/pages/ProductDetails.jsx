import { exampleImage } from "@/utils/images";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
                    withCredentials: true,
                });
                setProduct(res.data);
                console.log(res.data);
                
            } catch (err) {
                setError(err.response?.data?.message || "Product not found");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-gray-600">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid md:grid-cols-2 gap-10 items-center">
                {/* Product Image */}
                <div className="flex justify-center">
                    <img
                        src={exampleImage}
                        alt={product.name}
                        className="rounded-2xl shadow-lg w-full max-w-sm object-cover border"
                    />
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-semibold text-green-600">
                            ₹{product.discount_price}
                        </span>
                        <span className="text-gray-400 line-through">
                            ₹{product.MRP_in_INR}
                        </span>
                    </div>

                    <p className="text-gray-600 mb-2">
                        <strong>Quantity Available:</strong> {product.qty}
                    </p>
                    <p className="text-gray-600 mb-6">
                        <strong>Category:</strong> {product.category?.name}
                    </p>

                </div>
            </div>

            {/* Category Description */}
            {product.category?.description && (
                <div className="mt-10 border-t pt-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">
                        About Category
                    </h2>
                    <p className="text-gray-600">{product.category.description}</p>
                </div>
            )}
        </div>
    );
}
