import React from "react";

const Aboutus = () => {
  return (
    <div className="p-2 flex-col">
      <div className="main text-center">
        <h1 className="font-bold text-4xl">Skivvy - Skill Exchange Platform</h1>
        <p>connecting people through knowledge of sharing</p>
      </div>
      <hr />
      <div className="desc py-7 text-center">
        <h3 className="text-2xl font-medium">Description</h3>
        <p>
          Skivvy is a social marketplace platform where users exchange skills
          instead of money. Think Tinder-style matching but for learning - users
          list skills they can teach and skills they want to learn, then get
          matched for knowledge exchange sessions.
        </p>
      </div>
      <div className="fea text-center">
        <h3 className="text-xl font-semibold">Features</h3>
        <ul className='list-disc list-inside'>
          <li>Skill profiles with offerings and requests</li>
          <li>Smart matchmaking algorithms</li>
          <li>Session booking with calender integeration</li>
          <li>Rating and reveiw system</li>
          <li>Built-in chat and video calls</li>
        </ul>
      </div>
    </div>
  );
};

export default Aboutus;
