import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-10 min-h-screen bg-orange-100 text-black px-6 py-16 flex flex-col items-center justify-center">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold mb-6 text-center"
      >
        Contact <span className="text-orange-400">Us</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-2xl text-center text-gray-500 mb-12 text-lg leading-relaxed"
      >
        Have questions, ideas, or just want to say hi? We’d love to hear from
        you! Reach out to us through any of the ways below.
      </motion.p>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full mb-16">
        {[
          {
            icon: <Mail className="w-10 h-10 text-orange-400 mb-4" />,
            title: "Email",
            text: "adityaraghav239@gmail.com",
          },
          {
            icon: <Phone className="w-10 h-10 text-orange-400 mb-4" />,
            title: "Phone",
            text: "+91 7015233142",
          },
          {
            icon: <MapPin className="w-10 h-10 text-orange-400 mb-4" />,
            title: "Location",
            text: "Gurgaon, India",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg text-center hover:bg-orange-200 transition"
          >
            <div className="flex flex-col items-center">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
            required
          />
        </div>
        <textarea
          placeholder="Your Message..."
          rows="5"
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 resize-none"
          required
        ></textarea>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-orange-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-500 transition"
        >
          <Send className="w-5 h-5" /> Send Message
        </motion.button>
      </motion.form>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-gray-500 text-sm"
      >
        © {new Date().getFullYear()} Skivvy. All rights reserved.
      </motion.p>
    </div>
  );
};

export default Contact;
