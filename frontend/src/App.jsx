import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { Toaster } from "react-hot-toast";
import AllProducts from "./pages/AllProducts";
import CategoryProducts from "./pages/CategoryProducts";
import SearchPage from "./pages/Search";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Toaster />
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/category/:categoryId" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
