import React from 'react'
import { useLocation } from 'react-router-dom';
import {User, MapPin, PenTool, Book, Clock} from 'lucide-react';

const People = () => {
    const location = useLocation();
    const {profile} = location.state || {};
    console.log(profile);
    const featuredWork = profile.featuredWork || [];
    
  return (
    <div className='mt-20 bg-orange-100 min-h-screen p-4 gap-6 grid grid-cols-4 grid-rows-5 place-items-stretch'>

      {/* LEFT SIDEBAR */}
      <div className="item1 bg-white row-span-5 rounded-3xl shadow-lg">

        {/* USER INFO */}
        <div className=" mt-5 profile-container flex flex-col items-center justify-center p-4">
          <User className='w-36 h-36 rounded-full bg-orange-100 transition-colors relative shadow-md text-orange-600 p-5'/>
          <h2 className='text-2xl font-bold mt-5'>{profile?.name || 'Unnamed User'}</h2>
          <p className='flex p-1 text-gray-600 text-md items-center'><MapPin className='p-0.5 text-orange-900' />{profile?.location || 'unknown'}</p>
          <p className='text-gray-600 text-lg flex gap-1 items-center'><Clock className='p-0.5 text-red-600'/> {profile.duration} months</p>
        </div>

        {/* SKILLS OFFERED SECTION */}
        <div className="skills-offered flex flex-col gap-3 p-4">
          <h3 className='text-xl font-bold mt-6 flex items-center gap-1.5'><PenTool className='text-orange-500'/>Skills Offered</h3>
          <ul className='list-inside text-gray-700 text-center gap-3 flex flex-col items-center'>
            <li className='bg-orange-200 px-6 py-1 font-semibold rounded-lg'>{profile?.skillsOffered[0]}</li>
            <li className='bg-orange-200 px-6 py-1 rounded-lg font-semibold'>{profile?.skillsOffered[1]}</li>
          </ul>
        </div>

        {/* SKILLS SEEKING SECTION */}
        <div className="skills-seeking flex flex-col gap-3 p-4">
          <h3 className='text-xl font-bold mt-6 flex items-center gap-1.5'><Book className='text-blue-500'/>Skills Seeking</h3>
          <ul className='list-inside text-gray-700 items-center text-center gap-3 flex flex-col'>
            <li className='bg-orange-200 font-semibold px-6 py-1 rounded-lg'>{profile?.skillsWantToLearn[0]}</li>
            <li className='bg-orange-200 font-semibold rounded-lg px-6 py-1'>{profile?.skillsWantToLearn[1]}</li>
          </ul>
        </div>
    </div>


{/* BIO SECTION */}
    <div className="item2 col-span-3 bg-white rounded-3xl shadow-xl p-6 ">
      <h1 className='text-4xl font-bold'>Welcome to {profile?.name}'s Profile</h1>
      <p className='py-6 text-lg text-gray-700'>{profile?.bio}</p>
    </div>


{/* FEATURED WORK SECTION */}
    <div className="item3 col-span-3 row-span-3 rounded-3xl shadow-xl p-6 bg-white">
      <h1 className='text-4xl font-bold'>Fearuted work</h1>
      <p>{profile?.featuredWork || ''}</p>
    </div>


{/* ABOUT SECTION */}
    <div className="item4 bg-white rounded-3xl shadow-xl col-span-3 p-6">
      <h1 className='text-3xl font-bold'>About {profile.name}</h1>
      
    </div>
  </div>
  )
}

export default People;
