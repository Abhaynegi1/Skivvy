import React from "react";
import { UsersRound, Search, Handshake } from "lucide-react";

const Landing = () => {
  const trending = [
    { id: 1, title: "Photography" },
    { id: 2, title: "Coding" },
    { id: 3, title: "Marketing" },
    { id: 4, title: "Spanish" },
  ];

  return (
    <>
      <div className="flex items-center justify-center relative mt-20">
        <div className="hero-container absolute w-[90%] sm:w-4/5 h-[60vh] sm:h-[80vh] hero-bg rounded-2xl sm:rounded-3xl m-4 sm:m-10 p-4 sm:p-20 opacity-30"></div>
        <div className="absolute w-[90%] sm:w-4/5 h-[60vh] sm:h-[80vh] rounded-2xl sm:rounded-3xl m-4 sm:m-10 p-4 sm:p-20 bg-black opacity-75"></div>

        <div className="hero w-[90%] sm:w-4/5 h-[60vh] sm:h-[80vh] text-center flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl m-4 sm:m-10 p-4 sm:p-20 relative z-10">
          <h1 className="text-orange-400 text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Exchange skills, unlock potential
          </h1>

          <p className="mt-4 sm:mt-8 text-white font-normal text-base sm:text-lg md:text-2xl px-2 sm:px-10 md:px-16">
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
              {trending.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="bg-green-800 py-1 px-3 rounded-full text-white text-sm sm:text-base hover:bg-green-700 transition"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FEATURE SECTION */}

      <div className="how-it-works text-center my-20">
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
      </div>

      {/* REVEIW SECTION */}

      <div className="reveiw-container mt-10 md:mt-60 p-10 ">
        <h1 className="font-semibold text-4xl text-center">
          What people are saying
        </h1>
        <div className="reveiws flex flex-col md:flex-row justify-center mt-10 gap-10 md:gap-20 ">
          <div className="card flex flex-col overflow-hidden">
            <div className="review-1 w-full" style={{ height: "60%" }}></div>
            <div className="flex-1 p-4 flex flex-col justify-between items-center bg-orange-100">
              <p className="font-normal text-lg p-3">
                "Skivvy helped me find a fantastic tour for coding. The platform
                is easy to use and i've made great progress."
              </p>
              <p className="text-orange-600 text-xl">Sarah, Learner</p>
            </div>
          </div>
          <div className="card flex flex-col overflow-hidden">
            <div className="review-2 w-full" style={{ height: "60%" }}></div>
            <div className="flex-1 p-4 flex flex-col justify-between items-center bg-orange-100">
              <p className="font-normal text-lg p-3">
                "I've been teching phoptography on Skivvy and it's been a
                rewarding experience. The community is supportive and i've met
                some amazing people."
              </p>
              <p className="text-orange-600 text-xl">David, Teacher</p>
            </div>
          </div>
          <div className="card flex flex-col overflow-hidden">
            <div className="review-3 w-full" style={{ height: "60%" }}></div>
            <div className="flex-1 p-4 flex flex-col justify-center items-center bg-orange-100">
              <p>
                "I learned a new language through Skivvy and it was so much
                fun!The exchange format is brilliant and i've made a new friend
                in the process."
              </p>
              <p className="text-orange-600 text-xl">Emily, Learner</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
