import React from 'react'
import { UsersRound, Search, Handshake } from 'lucide-react';


const Landing = () => {
  const trending = [
    {id: 1, title: "Photography"},
    {id: 2, title: "Coding"},
    {id:3 , title: "Marketing"},
    {id:4 , title: "Spanish"}
  ]


  return (
    <>  
    <div className=" flex items-center justify-center relative">
      <div className="hero-container absolute w-4/5 h-[80vh] hero-bg rounded-3xl m-10 p-20 opacity-30"></div>
      <div className="absolute w-4/5 h-[80vh] rounded-3xl m-10 p-20 bg-black opacity-75"></div>
      <div className="hero w-4/5 h-[80vh] text-center flex-col text-4xl font-bold rounded-3xl m-10 p-20 relative z-10">
        <h1 className="text-orange-400 text-8xl ">Exchange skills, unlock potential</h1>
        <p className="p-8 text-white font-normal text-2xl">Skivvy connects learners and teachers, fostering a community of shared knowledge and growth. Offer you expertise, discover new skills, and expand your horizons</p>
        <div className="searchbar mt-20 flex flex-col items-center">
          <form className="w-1/2 flex items-center bg-white rounded-full px-4 py-2 shadow-md">
            <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path></svg>
            <input className="flex-1 bg-transparent outline-none text-black text-xl font-normal" type="search" placeholder="Search for a skill..." />
          </form>
          <ul className="flex text-center justify-center mt-3">
            <p className='text-white font-normal text-xl mt-2'>Trending:</p>
            {trending.map((item)=>(
              <li key={item.id} className='text-white text-xl font-normal py-2 px-1'>
                <a href={`#${item.id}`} className="bg-green-800 py-1 px-3 rounded-full">{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

{/* FEATURE SECTION */}

    <div className="how-it-works text-center my-20">
      <h1 className="text-4xl font-semibold">How it works</h1>
      <div className="features flex items-center justify-around w-4/5 mx-auto mt-10">
        <div className="feature1 w-1/6">
          <UsersRound className="mx-auto mt-20 bg-orange-100 p-4 rounded-full" size={80} color="orange"/>
          <h4 className='p-2 mt-4 font-semibold text-xl'>Connect with others</h4>
          <p className='text-lg p-1 text-gray-600'>join a vibrant community of passionate learners and skilled teachers.</p>
        </div>
        <div className="feature1 w-1/6">
          <Search className="mx-auto mt-20 bg-orange-100 p-4 rounded-full" size={80} color="orange"/>
          <h4 className='p-2 mt-4 font-semibold text-xl'>Find your perfect match</h4>
          <p className='text-lg p-1 text-gray-600'>Search for skills you want to learn or offer your expertise.</p>
        </div>
        <div className="feature1 w-1/6">
          <Handshake className="mx-auto mt-20 bg-orange-100 p-4 rounded-full" size={80} color="orange"/>
          <h4 className='p-2 mt-4 font-semibold text-xl'>Exchange sills</h4>
          <p className='text-lg p-1 text-gray-600'>Teach what you know and learn what you dont't. it's a win-win</p>
        </div>
      </div>
    </div>

{/* REVEIW SECTION */}

    <div className="reveiw-container mt-60">
      <h1 className='font-semibold text-4xl text-center'>What people are saying</h1>
      <div className="reveiws flex justify-center mt-10 gap-20">
          <div className="card flex flex-col overflow-hidden">
            <div className="review-1 w-full" style={{height: '60%'}}></div>
            <div className="flex-1 p-4 flex flex-col justify-between items-center bg-orange-100">
              <p className="font-normal text-lg p-3">"Skivvy helped me find a fantastic tour for coding. The platform is easy to use and i've made great progress."</p>
              <p className="text-orange-600 text-xl">Sarah, Learner</p>
            </div>
          </div>
        <div className="card flex flex-col overflow-hidden">
            <div className="review-2 w-full" style={{height: '60%'}}></div>
            <div className="flex-1 p-4 flex flex-col justify-between items-center bg-orange-100">
              <p className='font-normal text-lg p-3'>"I've been teching phoptography on Skivvy and it's been a rewarding experience. The community is supportive and i've met some amazing people."</p>
              <p className="text-orange-600 text-xl">David, Teacher</p>
            </div>
          </div>
          <div className="card flex flex-col overflow-hidden">
            <div className="review-3 w-full" style={{height: '60%'}}></div>
            <div className="flex-1 p-4 flex flex-col justify-center items-center bg-orange-100">
              <p>"I learned a new language through Skivvy and it was so much fun!The exchange format is brilliant and i've made a new friend in the process."</p>
              <p className="text-orange-600 text-xl">Emily, Learner</p>
            </div>
          </div>
      </div>
    </div>
    </>
  )
}

export default Landing
