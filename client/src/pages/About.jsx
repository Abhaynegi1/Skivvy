import React, {useEffect} from "react";
import { Users, Code, Sparkles, Globe2, Heart } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  return (
    <div className="mt-10 min-h-screen bg-orange-100 text-black px-6 py-16 flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold mb-6 text-center"
      >
        About <span className="text-orange-400">Skivvy</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-3xl text-center text-gray-400 mb-12 text-lg leading-relaxed"
      >
        Skivvy is a collaborative platform designed to connect creators,
        developers, and innovators in one vibrant digital community.
        Whether you’re building, learning, or sharing — Skivvy helps you
        showcase your work, find inspiration, and grow with others.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full mt-6">
        {[
          {
            icon: <Users className="w-10 h-10 text-orange-400 mb-4" />,
            title: "Community Driven",
            text: "Built around people who create. Share ideas, projects, and collaborate with like-minded individuals.",
          },
          {
            icon: <Code className="w-10 h-10 text-orange-400 mb-4" />,
            title: "Open & Innovative",
            text: "An open space for code, creativity, and discovery — powered by modern tools and ideas.",
          },
          {
            icon: <Globe2 className="w-10 h-10 text-orange-400 mb-4" />,
            title: "Global Vision",
            text: "Connect with creators worldwide and be part of a growing digital ecosystem.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg backdrop-blur-md hover:bg-orange-200 transition"
          >
            <div className="flex flex-col items-center text-center">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-16 flex items-center gap-2 text-gray-400"
      >
        <Heart className="w-5 h-5 text-pink-500" />
        <span>Made with passion for the creator community</span>
      </motion.div>
    </div>
  );
};

export default About;
