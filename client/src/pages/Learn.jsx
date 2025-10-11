import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Funnel, User, ArrowRightFromLine } from "lucide-react";
import Profile from '../components/Profiles';

const FiltersSection = () => {
  const [filters, setFilters] = useState({
    Photography: false,
    Coding: false,
    Marketing: false,
    Spanish: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFilters({ ...filters, [name]: checked });
  };

  return (
    <div className="filters-section flex flex-col gap-3 p-5">
      <h3 className="font-semibold text-normal">Skills</h3>
      {Object.keys(filters).map((filterName) => (
        <label
          key={filterName}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            name={filterName}
            checked={filters[filterName]}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-500 hover:scale-110 transition-all"
          />
          <span className="capitalize">{filterName}</span>
        </label>
      ))}
    </div>
  );
};

const Learn = () => {
  const skills = ['Web Development', 'Writing', 'Graphic designing', 'Programming', 'Gaming', 'Guitar', 'Singing', 'Video editing'];

  const profiles =[
    {name:'user 1', ss:skills[2], so:skills[5]},
    {name:'user 2', ss:skills[0], so:skills[7]},
    {name:'user 3', ss:skills[4], so:skills[0]},
    {name:'user 4', ss:skills[6], so:skills[1]},
    {name:'user 5', ss:skills[3], so:skills[2]},
  ]

  // FILTER SECTION
  const [selectedTime, setSelectedTime] = useState("");

  const timePeriod = [
    { id: 1, title: "Under 1 month" },
    { id: 2, title: "Under 3 months" },
    { id: 3, title: "Under 6 months" },
    { id: 4, title: "Under 1 year" },
  ];

  // SORT BY SECTION
  const[selectedValue, setSelectedValue] = useState('option1');

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  }

  return (
    <div className="flex justify-center mt-20 p-5">
      {/* FILTERS SECTION */}

      <div className="filters card px-5">
        <div className="filters-heading flex items-center justify-center">
          <Funnel className="bg-orange-400 text-white size-8 rounded-lg p-1" />
          <h3 className="font-semibold text-xl px-2">Filters</h3>
        </div>
        <FiltersSection />
        <h3 className="font-semibold text-normal p-5">Time period</h3>
        <div className="flex flex-col gap-2">
          {timePeriod.map((item) => (
            <label
              className="flex items-center gap-2 cursor-pointer"
              key={item.id}
            >
              <input
                type="radio"
                name="timePeriod"
                value={item.title}
                checked={selectedTime === item.title}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="form-radio border-gray-300 text-blue-600 hover:scale-110 transition-all"
              />
              <span>{item.title}</span>
            </label>
          ))}
        </div>
      </div>

      {/* LIST SECTION */}

      <div className="w-[60rem] px-10">
        <div className="sort-by-section px-2 bg-white py-1 rounded-xl drop-shadow-xl">
          <label htmlFor="dropdown">Sort by: </label>
        <select id="dropdown" className="mx-2 border-2 border-gray-300 rounded-lg" value={selectedValue} onChange={handleChange}>
          <option value="option1">Rating</option>
          <option value="option2">Time Period</option>
        </select>
        <select id="dropdown-2" className="border-2 border-gray-300 rounded-lg" value={selectedValue} onChange={handleChange}>
          <option value="option3">increasing</option>
          <option value="option4">decreasing</option>
        </select>
        </div>

        <div className="main mt-2"> 
          {profiles.map((p, index) => (
            <Profile key={index} name={p.name} so={p.so} ss={p.ss}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
