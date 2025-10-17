import React from "react";
import { User, ArrowRightFromLine } from "lucide-react";

const Profiles = ({ name, ss, so }) => {
  return (
    <div className="profile">
      <User className="size-20 bg-orange-200 rounded-full p-2" />
      <div className="info px-3">
        <button><h1 className="text-xl font-normal">{name}</h1></button>
        <div className="offering flex items-center gap-4 py-2">
          <p>Offered: 
          <button className='border-2 p-1 border-orange-400 rounded-full hover:bg-orange-400 hover:text-white duration-150'>{so}</button>
        </p>
        <p>Seeking: 
          <button className='border-2 border-orange-400 p-1 rounded-full hover:bg-orange-400 hover:text-white duration-150'>{ss}</button>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
