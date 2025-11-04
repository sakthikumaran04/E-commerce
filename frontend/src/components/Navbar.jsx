import { useEffect, useState } from "react";
import { Search, ChevronDown, User } from "lucide-react";
import { exampleImage, logoImg } from "@/utils/images";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [mode, setMode] = useState("simple");
  const navigate = useNavigate();
  const { isLogged, setIsLogged } = useAuth(); // 👈 shared state

  // ✅ Debounced search
  useEffect(() => {
    if (!query.trim()) return setResults([]);
    const delay = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/search/${mode}?q=${encodeURIComponent(query)}&page=1&limit=5`,
          { withCredentials: true }
        );
        setResults(res.data?.results || res.data || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [query, mode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}&mode=${mode}`);
      setSearchOpen(false);
    }
  };

  const handleLogin = async () => {
    if (isLogged) {
      try {
        await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
        setIsLogged(false);
        toast.success("Logged out successfully");
        navigate("/signin");
      } catch {
        toast.error("Logout failed");
      }
    } else {
      navigate("/signin");
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 shadow-md bg-white z-20 sticky top-0">
      <Link to="/" className="flex items-center gap-2">
        <img src={logoImg} alt="Logo" className="w-10" />
        <span className="font-bold text-xl">BlueKart</span>
      </Link>

      <div className="relative w-1/2 flex items-center justify-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center border rounded-lg px-3">
          <Search size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 p-2 outline-none"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="ml-2 text-sm bg-transparent outline-none cursor-pointer"
          >
            <option value="simple">Simple</option>
            <option value="elastic">Elastic</option>
          </select>
        </form>

        {isSearchOpen && results.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg z-20 p-2">
            {results.map((item) => (
              <div
                key={item.product_id}
                onMouseDown={() => navigate(`/product/${item.product_id}`)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={exampleImage}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">₹{item.discount_price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link to={"/allproducts"} className="hover:text-blue-600 hover:underline">
          all products
        </Link>
      </div>

      <div className="relative">
        <button
          className="flex items-center gap-2"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <User size={20} />
          <ChevronDown size={16} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 bg-white border shadow-md rounded-md mt-2 p-2 w-32">
            <button
              onClick={handleLogin}
              className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
            >
              {isLogged ? "Logout" : "Login"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
