import React from 'react'
import {navLinks} from '../assets/NavLinks'
const Header = () => {
  return (
    <nav className="flex items-center justify-around p-5 font-bold text-white bg-gray-800 rounded-2xl m-2">
        <a href="#home">Skivvy</a>
        <ul className="flex gap-20">
            {navLinks.map((link)=>(  
                <li key={link.id}>
                    <a href={`/${link.id}`}>{link.title}</a>
                </li>
            ))}
        </ul>
        <div className="btns bg-white text-black p-2 rounded-md">
            <button>Login/Sign up</button>
        </div>
    </nav>
  )
}

export default Header
