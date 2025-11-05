import React, { useEffect } from "react";
import { motion } from "framer-motion";

const TOS = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. Overview",
      text: "Skivvy is an educational web application that helps users visualize and analyze CPU scheduling algorithms. It is designed for students, educators, and developers who wish to explore operating system concepts interactively.",
    },
    {
      title: "2. Use of Service",
      text: "You agree to use Skivvy for lawful, educational, and non-commercial purposes. Any misuse, reverse engineering, or attempts to disrupt the Service are strictly prohibited. We reserve the right to suspend access for violations.",
    },
    {
      title: "3. User Accounts & Data",
      text: "Some features may require creating an account or providing information like your name or email. You are responsible for keeping this information accurate and secure. Refer to our Privacy Policy for details on how we handle data.",
    },
    {
      title: "4. Intellectual Property",
      text: "All designs, source code, and visuals within Skivvy are owned or licensed by the Skivvy team. You may not copy, modify, or redistribute any part of the Service without explicit permission. Educational sharing with credit is allowed.",
    },
    {
      title: "5. Disclaimer of Warranties",
      text: "Skivvy is provided 'as is' without any guarantees of accuracy, reliability, or availability. It is intended as a learning aid and should not be used for production or mission-critical simulations.",
    },
    {
      title: "6. Limitation of Liability",
      text: "In no event shall the Skivvy team or its contributors be held liable for any damages, losses, or claims arising from your use of the Service. You use Skivvy at your own risk.",
    },
    {
      title: "7. Modifications",
      text: "We may update or discontinue parts of the Service at any time without prior notice. Updates to these Terms will be posted here, and continued use indicates acceptance of changes.",
    },
    {
      title: "8. Governing Law",
      text: "These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts located in Gurgaon, Haryana.",
    },
    {
      title: "9. Contact",
      text: "For questions about these Terms, you can reach us at support@skivvy.app.",
    },
  ];

  return (
    <div className="mt-10 min-h-screen bg-orange-100 text-black px-6 py-16 flex flex-col items-center">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold mb-6 text-center"
      >
        Terms of <span className="text-orange-400">Service</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-3xl text-center text-gray-500 mb-12 text-lg leading-relaxed"
      >
        Please read these terms carefully before using Skivvy. By accessing or
        using the platform, you agree to be bound by these Terms of Service.
      </motion.p>

      {/* Terms Sections */}
      <div className="max-w-4xl w-full space-y-8">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:bg-orange-200 transition"
          >
            <h2 className="text-2xl font-semibold mb-3 text-orange-500">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">{section.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-gray-500 text-sm text-center"
      >
        © {new Date().getFullYear()} Skivvy. All rights reserved.
      </motion.p>
    </div>
  );
};

export default TOS;
