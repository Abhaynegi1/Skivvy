import React from "react";
import {
  UsersRound,
  Search,
  Handshake,
  Users,
  Code,
  Globe2,
} from "lucide-react";
import { motion } from "framer-motion";
import Silk from "../components/Silk";
import { WavyBackground } from "../components/ui/wavy-background";
import { CanvasRevealEffectDemo } from "../components/CanvasRevealEffectDemo";

const Landing = () => {
  const trending = ["Photography", "Coding", "Marketing", "Spanish"];

  return (
    <div className="overflow-x-hidden bg-white dark:bg-black">
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <p className="text-2xl md:text-4xl lg:text-7xl text-orange-400 font-bold inter-var text-center">
          Exchange skills, unlock <br />
          potential
        </p>
        <p className="text-base md:text-xl mt-4 text-secondary-accent font-normal inter-var text-center">
          Skivvy connects learners and teachers, fostering a cimmunity of shared
          knowledge and growth.
        </p>
        <div className="mt-10 flex flex-col items-center w-full">
          <form
            className="w-[90%] sm:w-3/4 md:w-1/2 flex items-center bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-border rounded-full px-4 py-2 shadow-md hover:shadow-orange-600/20 hover:shadow-xl duration-300 transition
"
          >
            <Search className="text-text-secondary w-5 h-5 mr-2" />
            <input
              className="flex-1 bg-transparent outline-none 
               text-text-primary placeholder:text-text-muted"
              type="search"
              placeholder="Search for a skill..."
            />
          </form>

          {/* Trending tags */}
          <ul className="flex flex-wrap justify-center items-center gap-2 mt-4">
            <p className="text-secondary-accent text-sm sm:text-base">
              Trending:
            </p>
            {trending.map((title, i) => (
              <li key={i}>
                <a
                  href={`#${i}`}
                  className="bg-accent text-secondary-accent py-1 px-3 rounded-full text-sm sm:text-base hover:bg-accent-hover transition hover:border-y-2 hover:border-secondary-accent"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </WavyBackground>
      {/* Peek Card Section */}
      <div className="relative -mt-20 flex justify-center px-4">
        <div
          className="
      w-full max-w-7xl 
      bg-card dark:bg-neutral-900 
      border-2 border-border 
      rounded-3xl 
      shadow-xl 
      p-6 md:p-10 
      min-h-[60vh]
    "
        >
          <section className=" mb-20 px-6 py-16 flex flex-col items-center justify-center">
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
                  className="bg-orange-100 dark:bg-[#dd6b20]/30 p-6 rounded-2xl shadow-lg  hover:shadow-accent/20 hover:-translate-y-3 transition-all duration-300 backdrop-blur-lg"
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
      </div>
{/* USAGE SECTION  */}
      <div className="usage"> 
        <h1 className="text-center text-orange-400 text-5xl font-bold mt-20">Usage</h1>
        <p className="text-center text-secondary-accent text-xl font-semibold mt-8">Follow these three simple steps to get started</p>
        <CanvasRevealEffectDemo/>
      </div>

{/* KINDOF TAGLINE */}

      <div className="tagline">
        <h1 className="text-center text-secondary-accent font-bold text-3xl my-20">👨‍🎓 Learn, Teach, Connect, Grow - the Skivvy way</h1>
      </div>
    </div>
  );
};

export default Landing;
