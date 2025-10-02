import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  const navLinks = [
    {id: "teach", title: "Teach"},
    {id: "learn", title:"Learn"},
    {id:"community", title:"Community"}
  ]


  return (
    <nav className="flex items-center justify-between p-5 bg-white px-10">
      <Link className="text-3xl font-bold text-orange-400" to="/home">Skivvy</Link>
      <ul className="flex gap-8 items-center">
        {navLinks.map((link) => (
          <li key={link.id}>
            <Link to={`/${link.id}`}>{link.title}</Link>
          </li>
        ))}
        <div className="flex gap-3">
          <button className="bg-orange-400 hover:bg-white hover:text-orange-400 duration-300 text-white py-2 px-4 font-bold rounded-2xl">Sign up</button>
          <button className="bg-blue-100 hover:text-orange-400 duration-300 hover:bg-white font-bold py-2 px-4 rounded-2xl">Login</button>
        </div>
      </ul>
    </nav>
  );
};

export default Header;
