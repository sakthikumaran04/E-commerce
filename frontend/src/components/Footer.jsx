import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Facebook, FacebookIcon, MailIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">BlueKart</h2>
          <p className="text-sm text-gray-400">
            Your one-stop shop for fashion, gadgets, and everything in between.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Categories</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to={"/category/3"} className="hover:text-white">Electronics</Link></li>
            <li><Link to={"/category/4"}  className="hover:text-white">Fashion</Link></li>
            <li><Link to={"/category/5"}  className="hover:text-white">Home & Kitchen</Link></li>
            <li><Link to={"/category/8"}  className="hover:text-white">Beauty</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Support</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Shipping Info</a></li>
            <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Follow Us</h2>
          <div className="flex gap-4">
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <InstagramLogoIcon />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              <TwitterLogoIcon />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <LinkedInLogoIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} BlueKart. All rights reserved.
      </div>
    </footer>
  );
}
