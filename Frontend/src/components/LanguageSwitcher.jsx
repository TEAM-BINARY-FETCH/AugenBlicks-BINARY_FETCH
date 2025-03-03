import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-4 p-4 justify-center">
      {["en", "hi"].map((lng, index) => (
        <motion.button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className="px-6 py-3 text-white font-bold rounded-full transition-all duration-300 
                     transform hover:scale-110 shadow-lg"
          style={{
            background: lng === "en" 
              ? "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)" 
              : "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
          }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
        >
          {lng === "en" ? "English" : "हिंदी"}
        </motion.button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
