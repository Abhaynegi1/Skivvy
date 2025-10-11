import React from "react";
import { User, ArrowRightFromLine } from "lucide-react";

const Profile = ({ name, ss, so }) => {
  return (
    <div className="profile">
      <User className="size-20 bg-orange-200 rounded-full p-2" />
      <div className="info px-3 ">
        <button><h1 className="text-xl font-normal">{name}</h1></button>
        <p>
          Skills offering: <mark>{so}</mark>,
        </p>
        <p className="py-1">
          Skills Seeking: <mark>{ss}</mark>
        </p>
      </div>

      <div className="info2 flex items-center">
        <div>
          <p>Rating: 4 star</p>
          <p>Available time: 3 months</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
