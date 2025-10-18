import React, { useState, useMemo } from "react";
import { Funnel, Heading1 } from "lucide-react";
import Profiles from "../components/Profiles";

const Learn = () => {
  const skills = [
    "Web Development",
    "Writing",
    "Graphic designing",
    "Programming",
    "Gaming",
    "Guitar",
    "Singing",
    "Video editing",
  ];

  // Profiles data
  const profiles = [
    { name: "user 1", s: "Guitar", s1: "Graphic designing", rating: 4.2, duration: 1 },
    { name: "user 2", s: "Video editing", s1: "Web Development", rating: 3.8, duration: 3 },
    { name: "user 3", s: "Web Development", s1: "Gaming", rating: 4.9, duration: 6 },
    { name: "user 4", s: "Writing", s1: "Singing", rating: 2.5, duration: 12 },
    { name: "user 5", s: "Graphic designing", s1: "Programming", rating: 4.5, duration: 9 },
  ];

  // Filter states
  const [selectedSkills, setSelectedSkills] = useState({});
  const [selectedTime, setSelectedTime] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("increasing");

  const handleSkillChange = (e) => {
    const { name, checked } = e.target;
    setSelectedSkills({ ...selectedSkills, [name]: checked });
  };

  const timePeriod = [
    { id: 1, title: "Under 1 month", value: 1 },
    { id: 2, title: "Under 3 months", value: 3 },
    { id: 3, title: "Under 6 months", value: 6 },
    { id: 4, title: "Under 1 year", value: 12 },
  ];

  // Filter + sort logic
  const filteredProfiles = useMemo(() => {
    let filtered = [...profiles];

    // Filter by skills
    const activeSkills = Object.keys(selectedSkills).filter((key) => selectedSkills[key]);
    if (activeSkills.length > 0) {
      filtered = filtered.filter(
        (p) => activeSkills.includes(p.so) || activeSkills.includes(p.ss)
      );
    }

    // Filter by time period
    if (selectedTime) {
      const timeObj = timePeriod.find((t) => t.title === selectedTime);
      if (timeObj) {
        filtered = filtered.filter((p) => p.duration <= timeObj.value);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      const field = sortBy === "rating" ? "rating" : "duration";
      const diff = a[field] - b[field];
      return sortOrder === "increasing" ? diff : -diff;
    });

    return filtered;
  }, [profiles, selectedSkills, selectedTime, sortBy, sortOrder]);

  return (
    <> 
    <div className="flex justify-center mt-20 p-5 flex-wrap gap-10 bg-orange-100">
      {/* FILTERS SECTION */}
      <div className="filters bg-white shadow-xl rounded-2xl p-5 w-72 h-fit">
        <div className="filters-heading flex items-center gap-2 mb-5">
          <Funnel className="bg-orange-400 text-white size-8 rounded-lg p-1" />
          <h3 className="font-semibold text-xl text-gray-700">Filters</h3>
        </div>

        {/* Skills */}
        <div>
          <h3 className="font-semibold text-md mb-3">Skills</h3>
          <div className="flex flex-col gap-2">
            {skills.map((skill) => (
              <label key={skill} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={skill}
                  checked={selectedSkills[skill] || false}
                  onChange={handleSkillChange}
                  className="form-checkbox h-5 w-5 text-orange-500 rounded border-gray-300 focus:ring-2 focus:ring-orange-400"
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Time Period */}
        <div className="mt-6">
          <h3 className="font-semibold text-md mb-3">Time period</h3>
          <div className="flex flex-col gap-2">
            {timePeriod.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="timePeriod"
                  value={item.title}
                  checked={selectedTime === item.title}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="form-radio text-orange-500 border-gray-300 focus:ring-2 focus:ring-orange-400"
                />
                <span>{item.title}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* PROFILES + SORT SECTION */}
      <div className="flex flex-col w-[60rem]">
        <div className="sort-by-section bg-white p-3 rounded-xl shadow-md flex items-center gap-3 mb-5">
          <label className="text-gray-700 font-medium">Sort by:</label>
          <select
            className="border border-gray-300 rounded-lg px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Rating</option>
            <option value="duration">Time Period</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg px-2 py-1"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="increasing">increasing</option>
            <option value="decreasing">decreasing</option>
          </select>
        </div>

        <div className="main space-y-4">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((p, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-200"
              >
                <Profiles name={p.name} s={p.s} s1={p.s1} duration={p.duration} label='Offered:'/>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-10">
              No profiles match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Learn;
