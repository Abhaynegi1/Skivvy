import React from "react";
import p1 from "../assets/profile-1.png";
import { Camera, Code, PenTool, Music2, BookOpenText, Book } from "lucide-react";

const profile = () => {
  const skillsOffered = [
    {
      id: 1,
      title: "Graphic Design",
      icon: <PenTool className="text-teal-500" />,
    },
    { id: 2, title: "Photography", icon: <Camera className="text-teal-500" /> },
    {
      id: 3,
      title: "Web Development",
      icon: <Code className="text-teal-500" />,
    },
  ];

  const skillsSeeking =[
    {id:1, title: "Music Composition", icon: <Music2 className="text-teal-500" />},
    {id:2, title: "Creative Writing", icon: <Book className="text-teal-500" />},
  ]

  return (

    <div className="bg-orange-100 min-h-screen p-5 gap-10 grid grid-cols-4 grid-rows-5 place-items-stretch ">
      {/* <div className="profile-container p-2 grid-flow-rows gap-4">
        <img src={p1} alt="p1" className="w-52 h-52 rounded-full"/>
      </div> */}
{/* PROFILE CONTAINER */}
      <div className="item1 bg-white row-span-5 rounded-3xl">
        <div className="profile-container flex flex-col items-center justify-center">
          <img src={p1} alt="p1" className="w-44 h-44 my-7 rounded-full" />
          <h4 className="font-semibold text-2xl">Sarah Learner</h4>
          <p className="text-lg text-gray-600">Graphic Designer</p>
          <p className="text-md text-gray-600">Member since 2021</p>
        </div>
{/* FEATURED CONTAINER */}
        <div className="featured flex items-center justify-center p-5 gap-5">
          <div className="rating featured-style">
            <h2 className="text-3xl font-semibold">4.9</h2>
            <p className="font-normal text-gray-700">Rating</p>
          </div>
          <div className="projects featured-style">
            <h2 className="text-3xl font-semibold">100+</h2>
            <p>Projects</p>
          </div>
          <div className="skills featured-style">
            <h2 className="text-3xl font-semibold">50+</h2>
            <p>Skills</p>
          </div>
        </div>

        <div className=" skills-offered flex flex-col gap-3 p-5">
          <h2 className="text-2xl font-semibold">Skills Offered</h2>
          {skillsOffered.map((service) => (
            <div
              key={service.id}
              className="flex items-center gap-3 border border-orange-200 rounded-md py-3 px-4 shadow-sm hover:shadow-md transition-all duration-200 "
            >
              <span className="text-lg">{service.icon}</span>
              <p className="font-medium text-gray-800">{service.title}</p>
            </div>
          ))}
        </div>

        <div className=" skills-seeking flex flex-col gap-3 p-5">
          <h2 className="text-2xl font-semibold">Skills Offered</h2>
          {skillsSeeking.map((service) => (
            <div
              key={service.id}
              className="flex items-center gap-3 border border-orange-200 rounded-md py-3 px-4 shadow-sm hover:shadow-md transition-all duration-200 "
            >
              <span className="text-lg">{service.icon}</span>
              <p className="font-medium text-gray-800">{service.title}</p>
            </div>
          ))}
        </div>
      </div>

{/* SUMMARY CONTAINER */}
      <div className="item2 bg-white col-span-3 rounded-3xl p-2">
          <h1 className="text-3xl mt-4 ml-4 font-semibold">I will create stunning logos for your brand</h1>
          <p className="ml-4 mt-2 text-lg text-gray-600">I'm a professional graphic designer with over 5 years of experience. I specialize in creating unique and memorable logos that capture the essence of your brand. Let's collaborate to bring your vision to life!</p>
      </div>
      <div className="item3 bg-white rounded-3xl col-span-3 row-span-3"></div>
      <div className="item4 bg-white rounded-3xl col-span-3 p-3">
        <h1 className="text-3xl mt-4 ml-4 font-semibold">About This Offering</h1>
        <p className="ml-4 mt-2 text-lg text-gray-600">I offer a comprehensive logo design service that includes initial concept development. multiple revisions, and final delivery of high-resolution files. My Process involves understanding your brand's value, target audience. and aesthetic preferences to create logo that resonates with your identity. I'm commited delivering exceptional quality and ensuring your satisfaction</p>
      </div>
    </div>
  );
};

export default profile;
