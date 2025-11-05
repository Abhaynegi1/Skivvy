import React from "react";
import { UsersRound, Search, Handshake, Users, Code, Globe2 } from "lucide-react";
import Silk from "../components/Silk";
import {motion} from "framer-motion";
const Landing = () => {
  const trending = [
    { id: 1, title: "Photography" },
    { id: 2, title: "Coding" },
    { id: 3, title: "Marketing" },
    { id: 4, title: "Spanish" },
  ];

  return (
    <>
      {/* HERO SECTION */}
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}> 
      <div className="relative flex items-center justify-center mt-24 h-[85vh] overflow-hidden rounded-2xl sm:rounded-3xl w-[90%] sm:w-4/5 mx-auto">
        <div className="absolute inset-0">
          <Silk
            speed={5}
            scale={1}
            color="#f6ad55"
            noiseIntensity={1.5}
            rotation={1}
            className="w-full h-full"
          />
        </div>

        {/* Subtle gradient overlay instead of flat black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        {/* Hero content */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center px-4 sm:px-10 md:px-16 max-w-4xl">
          <h1 className="text-orange-400 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Exchange skills, unlock potential
          </h1>

          <p className="mt-4 sm:mt-8 text-white font-normal text-base sm:text-lg md:text-2xl">
            Skivvy connects learners and teachers, fostering a community of
            shared knowledge and growth. Offer your expertise, discover new
            skills, and expand your horizons.
          </p>

          {/* Search bar */}
          <div className="searchbar mt-8 sm:mt-16 flex flex-col items-center w-full">
            <form className="w-[90%] sm:w-3/4 md:w-1/2 flex items-center bg-white rounded-full px-3 sm:px-4 py-2 shadow-md">
              <Search className="text-gray-400 w-5 h-5 mr-2" />
              <input
                className="flex-1 bg-transparent outline-none text-gray-700 text-base sm:text-lg font-normal"
                type="search"
                placeholder="Search for a skill..."
              />
            </form>

            {/* Trending tags */}
            <ul className="flex flex-wrap justify-center items-center gap-2 mt-4">
              <p className="text-white font-normal text-sm sm:text-lg">
                Trending:
              </p>
              {["Photography", "Coding", "Marketing", "Spanish"].map(
                (title, i) => (
                  <li key={i}>
                    <a
                      href={`#${i}`}
                      className="bg-green-800 py-1 px-3 rounded-full text-white text-sm sm:text-base hover:bg-green-700 transition"
                    >
                      {title}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
      </motion.div>

      {/* HOW IT WORKS SECTION */}
      {/* <div className="how-it-works text-center my-20">
        <h1 className="text-3xl md:text-4xl font-semibold">How it works</h1>
        <div className="features flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 w-[90%] md:w-4/5 mx-auto mt-10">
          {[
            {
              Icon: UsersRound,
              title: "Connect with others",
              desc: "Join a vibrant community of passionate learners and skilled teachers.",
            },
            {
              Icon: Search,
              title: "Find your perfect match",
              desc: "Search for skills you want to learn or offer your expertise.",
            },
            {
              Icon: Handshake,
              title: "Exchange skills",
              desc: "Teach what you know and learn what you don't. It's a win-win.",
            },
          ].map((f, i) => (
            <div key={i} className="feature w-full md:w-1/4">
              <f.Icon
                className="mx-auto mt-10 md:mt-20 bg-orange-100 p-4 rounded-full"
                size={60}
                color="orange"
              />
              <h4 className="mt-4 font-semibold text-lg md:text-xl">
                {f.title}
              </h4>
              <p className="text-gray-600 text-base md:text-lg px-4">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div> */}
      <div className="mt-10 mb-20 text-black px-6 py-16 flex flex-col items-center justify-center">
        <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl font-bold mb-6 text-center"
              >
                About <span className="text-orange-400">Skivvy</span>
              </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full mt-20">
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
      </div>

      {/* REVIEW SECTION */}
      {/* <div className="review-container mt-10 md:mt-60 p-10">
        <h1 className="font-semibold text-4xl text-center">
          What people are saying
        </h1>
        <div className="reviews flex flex-col md:flex-row justify-center mt-10 gap-10 md:gap-20">
          {[
            {
              quote:
                "Skivvy helped me find a fantastic tutor for coding. The platform is easy to use and I've made great progress.",
              author: "Sarah, Learner",
            },
            {
              quote:
                "I've been teaching photography on Skivvy and it's been a rewarding experience. The community is supportive and I've met some amazing people.",
              author: "David, Teacher",
            },
            {
              quote:
                "I learned a new language through Skivvy and it was so much fun! The exchange format is brilliant and I've made a new friend in the process.",
              author: "Emily, Learner",
            },
          ].map((review, i) => (
            <div
              key={i}
              className="card flex flex-col overflow-hidden rounded-2xl shadow-md"
            >
              <div
                className={`review-${i + 1} w-full bg-gray-200`}
                style={{ height: "60%" }}
              ></div>
              <div className="flex-1 p-4 flex flex-col justify-between items-center bg-orange-100">
                <p className="font-normal text-lg p-3 text-center">
                  "{review.quote}"
                </p>
                <p className="text-orange-600 text-xl">{review.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
};

export default Landing;
