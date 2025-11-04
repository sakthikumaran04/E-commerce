import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext"; // 👈 import your AuthContext

export default function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setIsLogged } = useAuth(); // 👈 get updater from context

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signin",
        formData,
        { withCredentials: true }
      );

      console.log("✅ API Response:", res.data);
      toast.success("Signin successful");

      // 🔥 Instantly update Navbar login state
      setIsLogged(true);

      setFormData({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      console.error(
        "❌ Signin Error:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg mt-10">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="text-xl font-semibold text-primary">
              Welcome Back
            </FieldLegend>
            <FieldDescription>
              Please enter your credentials to sign in.
            </FieldDescription>

            {/* Email */}
            <Field className="mt-4">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                placeholder="example@mail.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </Field>

            {/* Password */}
            <Field className="mt-4">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </Field>

            <div className="flex items-center justify-between px-1 mt-2">
              <p className="text-sm">Don’t have an account?</p>
              <Link to={"/signup"} className="text-sm text-blue-600 underline">
                Sign Up
              </Link>
            </div>

            <Button type="submit" className="w-full mt-3">
              Sign In
            </Button>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  );
}
