import React from 'react'
import {Link} from "react-router-dom";
//just want to check if my push are working 
const Footer = () => {
  const footLinks = [
    {id: "about", title: "About"},
    {id: "contact", title:"Contact"},
    {id: "terms", title: "Terms of Service"},
    {id: "privacy", title: "Privacy Policy"}
  ]


  return (
    <div className="flex justify-between items-center mt-40 p-10">
      <ul className="flex gap-8 text-zinc-600 text-lg">
        {footLinks.map((link)=>(
          <li key={link.id}>
            <Link to={`/${link.id}`}>{link.title}</Link>
          </li>
        ))}
      </ul>
      <p className="text-gray-500 text-normal">&copy; 2025 Skivvy. All rights reserved.</p>
    </div>
  )
}

export default Footer;
