import React from "react";
import { UsersRound, Search, Handshake, Users, Code, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import Silk from "../components/Silk";

const Landing = () => {
  const trending = ["Photography", "Coding", "Marketing", "Spanish"];

  return (
    <div className="bg-white dark:bg-black text-text-primary min-h-screen overflow-hidden">
      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex items-center justify-center mt-24 h-[85vh] overflow-hidden rounded-3xl w-[90%] sm:w-4/5 mx-auto shadow-xl"
      >
        {/* Animated background silk */}
        <div className="absolute inset-0">
          <Silk
            speed={5}
            scale={1}
            color="#FFA500"
            noiseIntensity={1.5}
            rotation={1}
            className="w-full h-full"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 dark:from-black/80 dark:via-black/60 dark:to-black/80 backdrop-blur-sm"></div>

        {/* Hero content */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center px-4 sm:px-10 max-w-4xl">
          <h1 className="text-[var(--color-main)] text-4xl sm:text-6xl md:text-7xl font-bold leading-tight">
            Exchange skills, unlock potential
          </h1>
          <p className="mt-6 text-white text-base sm:text-lg md:text-2xl">
            Skivvy connects learners and teachers, fostering a community of shared knowledge and growth.
          </p>

          {/* Search bar */}
          <div className="mt-10 flex flex-col items-center w-full">
            <form className="w-[90%] sm:w-3/4 md:w-1/2 flex items-center bg-card border border-border rounded-full px-4 py-2 shadow-md backdrop-blur-lg">
              <Search className="text-text-secondary w-5 h-5 mr-2" />
              <input
                className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-muted"
                type="search"
                placeholder="Search for a skill..."
              />
            </form>

            {/* Trending tags */}
            <ul className="flex flex-wrap justify-center items-center gap-2 mt-4">
              <p className="text-white text-sm sm:text-base">Trending:</p>
              {trending.map((title, i) => (
                <li key={i}>
                  <a
                    href={`#${i}`}
                    className="bg-accent text-white py-1 px-3 rounded-full text-sm sm:text-base hover:bg-accent-hover transition"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* ABOUT SECTION */}
      <section className="mt-20 mb-20 px-6 py-16 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-6 text-center"
        >
          About <span className="text-[var(--color-main)]">Skivvy</span>
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full mt-16">
          {[
            {
              icon: <Users className="w-10 h-10 text-accent mb-4" />,
              title: "Community Driven",
              text: "Built around people who create. Share ideas, projects, and collaborate with like-minded individuals.",
            },
            {
              icon: <Code className="w-10 h-10 text-accent mb-4" />,
              title: "Open & Innovative",
              text: "An open space for code, creativity, and discovery — powered by modern tools and ideas.",
            },
            {
              icon: <Globe2 className="w-10 h-10 text-accent mb-4" />,
              title: "Global Vision",
              text: "Connect with creators worldwide and be part of a growing digital ecosystem.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
              className="bg-orange-100 dark:bg-[#131B38] p-6 rounded-2xl shadow-lg border border-border hover:shadow-accent/20 hover:-translate-y-3 transition-all duration-300 backdrop-blur-lg"
            >
              <div className="flex flex-col items-center text-center">
                {item.icon}
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-main)]">
                  {item.title}
                </h3>
                <p className="text-text-primary text-sm">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
