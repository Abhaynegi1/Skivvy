import React from 'react'
import { useLocation } from 'react-router-dom';

const People = () => {
    const location = useLocation();
    const {profile} = location.state || {};
    console.log(profile);
    
  return (
    <div className='mt-24'>
      this is other profile page{profile.name}
    </div>
  )
}

export default People;
