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

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

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

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email))
            newErrors.email = "Enter a valid email address";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8)
            newErrors.password = "Password must be at least 8 characters long";

        if (formData.confirmPassword !== formData.password)
            newErrors.confirmPassword = "Passwords do not match";

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
                "http://localhost:5000/api/auth/signup",
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true }
            );

            console.log("✅ API Response:", res);
            toast.success("Signup successful");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
            navigate("/signin");
        } catch (error) {
            console.error("❌ Signup Error:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Something went wrong. Try again!")
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg mt-10">
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend className="text-xl font-semibold text-primary">
                            Create an Account
                        </FieldLegend>
                        <FieldDescription>
                            Please fill in the details below to sign up.
                        </FieldDescription>

                        {/* First & Last Name */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <Field>
                                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                )}
                            </Field>
                        </div>

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

                        {/* Confirm Password */}
                        <Field className="mt-4">
                            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                            <Input
                                id="confirmPassword"
                                placeholder="••••••••"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </Field>

                        <div className="flex items-center justify-between px-1 mt-2">
                            <p className="text-sm">Already have an account?</p>
                            <Link to={"/signin"} className="text-sm text-blue-600 underline">
                                Sign In
                            </Link>
                        </div>

                        <Button type="submit" className="w-full mt-3">
                            Sign Up
                        </Button>
                    </FieldSet>
                </FieldGroup>
            </form>
        </div>
    );
}
