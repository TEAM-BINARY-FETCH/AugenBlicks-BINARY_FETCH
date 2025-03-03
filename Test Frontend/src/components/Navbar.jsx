import { Link, useLocation } from "react-router-dom";
import { Home, Contacts, Login } from "@mui/icons-material";
import { Menu } from "@mui/icons-material";
import { useState } from "react";
import { motion } from "framer-motion";
import logo from "./../assets/images/logo.png";
import { useAuthContext } from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { authUser } = useAuthContext();
  const { t } = useTranslation(); // Initialize useTranslation

  const isActive = (path) => location.pathname === path;

  const linkStyle = `
    relative 
    after:content-[''] 
    after:absolute 
    after:bottom-0 
    after:left-0 
    after:w-full 
    after:h-[2px] 
    after:bg-gray-700 
    after:origin-left 
    after:scale-x-0 
    after:transition-transform 
    after:duration-300
    hover:after:scale-x-100
  `;

  return (
    <nav className="bg-white text-black shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo and Name - Left aligned */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="text-xl font-bold">{t("navbar.brandName")}</span>
        </div>

        {/* Desktop Menu - Right aligned */}
        <ul className="hidden md:flex items-center space-x-6 ml-auto mr-4">
          <li>
            <Link
              to="/"
              className={`flex items-center gap-2 p-2 transition-colors ${linkStyle} ${
                isActive("/")
                  ? "text-gray-500 border-b-2 border-gray-500"
                  : "hover:text-gray-700"
              }`}
            >
              <Home />
              <span>{t("navbar.home")}</span>
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`flex items-center gap-2 p-2 transition-colors ${linkStyle} ${
                isActive("/contact")
                  ? "text-gray-500 border-b-2 border-gray-500"
                  : "hover:text-gray-700"
              }`}
            >
              <Contacts />
              <span>{t("navbar.contactUs")}</span>
            </Link>
          </li>
          {!authUser && (
            <li>
              <Link
                to="/login"
                className="flex items-center gap-2 p-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <span>{t("navbar.login")}</span>
              </Link>
            </li>
          )}
          {authUser && (
            <li>
              <Link
                to="/login"
                className="flex items-center gap-2 p-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <Login />
                <span>{t("navbar.logout")}</span>
              </Link>
            </li>
          )}
        </ul>
        <LanguageSwitcher />
        {/* Mobile Menu Button - Right aligned */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 focus:outline-none ml-auto"
        >
          <Menu className="text-black" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-md"
        >
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <Link
                to="/"
                className={`flex items-center gap-2 p-2 transition-colors ${linkStyle} ${
                  isActive("/")
                    ? "text-gray-500 border-b-2 border-gray-500"
                    : "hover:text-gray-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Home />
                <span>{t("navbar.home")}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`flex items-center gap-2 p-2 transition-colors ${linkStyle} ${
                  isActive("/contact")
                    ? "text-gray-500 border-b-2 border-gray-500"
                    : "hover:text-gray-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Contacts />
                <span>{t("navbar.contactUs")}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="flex items-center gap-2 p-2 text-red-600 hover:text-red-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Login />
                <span>{t("navbar.login")}</span>
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
}