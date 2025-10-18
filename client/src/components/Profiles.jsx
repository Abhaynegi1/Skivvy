import React from "react";
import { User, ArrowRightFromLine, Clock } from "lucide-react";

const Profiles = ({ name, s, s1, label, duration }) => {
  return (
    <div className="profile">
      <User className="size-20 bg-orange-200 rounded-full p-2" />
      <div className="info px-3">
        <button><h1 className="text-xl font-normal">{name}</h1></button>
        <div className="offering flex items-center gap-4 py-2">
          <p>{label} 
          <button className='border-2 p-1 border-orange-400 rounded-full hover:bg-orange-400 hover:text-white duration-150 mx-2'>{s}</button>
          <button className='border-2 p-1 border-orange-400 rounded-full hover:bg-orange-400 hover:text-white duration-150'>{s1}</button>
        </p>

        <div className="time-period">
          <button className="flex gap-1 items-center justify-center border-2 border-blue-600 rounded-full p-1 hover:bg-blue-600 duration-150"><Clock/>{duration}</button>
        </div>
        
        </div>
      </div>
    </div>
  );
};

export default Profiles;
