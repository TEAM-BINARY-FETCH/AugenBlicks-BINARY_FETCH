import { useState } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields!");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating API call
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-3xl bg-white text-black p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Contact Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center text-gray-800">
              <FaPhone className="text-yellow-500 text-xl mr-3" />
              <span className="font-medium">+91 98765 43210</span>
            </div>
            <div className="flex items-center text-gray-800">
              <FaEnvelope className="text-yellow-500 text-xl mr-3" />
              <span className="font-medium">support@podcastwave.com</span>
            </div>
            <div className="flex items-center text-gray-800">
              <FaMapMarkerAlt className="text-yellow-500 text-xl mr-3" />
              <span className="font-medium">
                5th Floor, Media Hub Tower, Mumbai, India
              </span>
            </div>
            <div className="text-gray-600 text-sm mt-4">
              <p>📌 **Business Hours:** Monday - Friday (9 AM - 6 PM IST)</p>
              <p>📢 **Follow us on social media: @PodcastWave</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-400 outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-400 outline-none"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="4"
              required
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-400 outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-black font-semibold rounded-lg p-3 hover:bg-yellow-600 transition duration-200 w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
