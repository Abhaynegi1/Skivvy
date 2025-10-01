import React from 'react'
import Header from '../components/Header'


const Landing = () => {
  return (
    // <div>
    //   <div className="hero width-full h-[80vh] flex items-center justify-center bg-gray-200 text-4xl font-bold">
    //     <h1>LEARN SOMETHING NEW</h1>
    //   </div>
    // </div>
    <div className="hero-container flex items-center justify-center relative">
      <div className="absolute w-4/5 h-[80vh] hero-bg rounded-3xl m-10 p-20 opacity-30"></div>
      <div className="absolute w-4/5 h-[80vh] rounded-3xl m-10 p-20 bg-black opacity-75"></div>
      <div className="hero w-4/5 h-[80vh] text-center flex-col text-4xl font-bold rounded-3xl m-10 p-20 relative z-10">
        <h1 className="text-orange-400 text-8xl ">Exchange skills, unlock potential</h1>
        <p className="p-8 text-white font-normal text-2xl">Skivvy connects learners and teachers, fostering a community of shared knowledge and growth. Offer you expertise, discover new skills, and expand your horizons</p>
        <div className="searchbar mt-20 ">
          <input className="border-2 border-white rounded-full p-2 w-1/2 mx-auto" type="text"/>
        </div>
      </div>
    </div>
  )
}

export default Landing
