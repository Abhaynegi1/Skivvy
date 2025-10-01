import React from "react";
import { navLinks } from "../assets/NavLinks";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <nav className="flex items-center justify-around p-5 font-bold text-white bg-gray-800 rounded-2xl m-2">
      <Link to="/home">Skivvy</Link>
      <ul className="flex gap-20">
        {navLinks.map((link) => (
          <li key={link.id}>
            <Link to={`/${link.id}`}>{link.title}</Link>
          </li>
        ))}
      </ul>
      <div className="btns bg-white text-black p-2 rounded-md hover:bg-gray-800 hover:text-white duration-300">
        <button>Login/Sign up</button>
      </div>
    </nav>
  );
};

export default Header;
