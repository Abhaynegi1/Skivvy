import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Funnel } from "lucide-react";

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
  return (
    <div className="flex items-center justify-evenly mt-20 p-2">
      <div className="filters card px-5">
        <div className="filters-heading flex items-center justify-center">
          <Funnel className="bg-orange-500 text-white size-8 rounded-lg p-1" />
          <h3 className="font-semibold text-xl px-2">Filters</h3>
        </div>
        <FiltersSection />
      </div>
      <div className="learn w-[50px] h-[50px] bg-blue-600"></div>
    </div>
  );
};

export default Learn;
