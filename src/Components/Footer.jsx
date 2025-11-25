import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#141414] text-gray-200 py-12 mt-24 md:mt-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center sm:text-left">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#00FFFF] transition-colors block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-[#00FFFF] transition-colors block"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-[#00FFFF] transition-colors block"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-[#00FFFF] transition-colors block"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-center sm:justify-start items-center">
                <Mail size={16} className="mr-2 text-[#00FFFF]" />
                <span>support@eboost.com</span>
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <Phone size={16} className="mr-2 text-[#00FFFF]" />
                <span>+91 7510857814</span>
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <MapPin size={16} className="mr-2 text-[#00FFFF]" />
                <span>1240 Game Street, Calicut, Kerala 67508</span>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Follow Us
            </h3>
            <div className="flex justify-center sm:justify-start space-x-6">
              <a
                href="#"
                className="hover:text-[#00FFFF] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-[#00FFFF] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-[#00FFFF] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025{" "}
            <span className="text-[#00FFFF] font-semibold">Eboost</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
