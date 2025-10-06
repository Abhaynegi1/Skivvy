import React, { useState, useEffect } from "react";
import p1 from "../assets/profile-1.png";
import { Camera, Code, PenTool, Music2, BookOpenText, Book, User } from "lucide-react";
import { authAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Check if user is authenticated
      if (!authAPI.isAuthenticated()) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.user);
        } else {
          setError('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently joined';
    const date = new Date(dateString);
    return `Member since ${date.getFullYear()}`;
  };

  return (

    <div className="bg-orange-100 min-h-screen p-5 gap-10 grid grid-cols-4 grid-rows-5 place-items-stretch mt-20">
      {/* <div className="profile-container p-2 grid-flow-rows gap-4">
        <img src={p1} alt="p1" className="w-52 h-52 rounded-full"/>
      </div> */}
{/* PROFILE CONTAINER */}
      <div className="item1 bg-white row-span-5 rounded-3xl">
        <div className="profile-container flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-44 h-44 my-7 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
              <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-44 h-44 my-7 rounded-full bg-red-100 flex items-center justify-center">
                <User className="w-16 h-16 text-red-400" />
              </div>
              <h4 className="font-semibold text-2xl text-red-600">Error Loading Profile</h4>
              <p className="text-lg text-gray-600">Please try again later</p>
            </div>
          ) : (
            <>
              <img src={p1} alt="Profile" className="w-44 h-44 my-7 rounded-full" />
              <h4 className="font-semibold text-2xl">{user?.username || 'User'}</h4>
              <p className="text-lg text-gray-600">{user?.email || 'No email provided'}</p>
              <p className="text-md text-gray-600">{formatDate(user?.createdAt)}</p>
            </>
          )}
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
          {loading ? (
            <div className="p-4">
              <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="h-6 w-full bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-6 w-5/6 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ) : error ? (
            <div className="p-4">
              <h1 className="text-3xl mt-4 ml-4 font-semibold text-red-600">Unable to load profile</h1>
              <p className="ml-4 mt-2 text-lg text-gray-600">There was an error loading your profile information. Please try refreshing the page.</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl mt-4 ml-4 font-semibold">Welcome to {user?.username}'s Profile</h1>
              <p className="ml-4 mt-2 text-lg text-gray-600">
                Hello! I'm {user?.username}, and I'm excited to be part of the Skivvy community. 
                I joined in {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'recently'} and I'm looking forward to sharing my skills and learning from others.
              </p>
            </>
          )}
      </div>

{/* FEATURED WORK */}
      <div className="item3 bg-white rounded-3xl col-span-3 row-span-3">


      </div>

      <div className="item4 bg-white rounded-3xl col-span-3 p-3">
        <h1 className="text-3xl mt-4 ml-4 font-semibold">About {user?.username || 'This User'}</h1>
        {loading ? (
          <div className="ml-4 mt-2">
            <div className="h-6 w-full bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-6 w-5/6 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-6 w-4/5 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : error ? (
          <p className="ml-4 mt-2 text-lg text-gray-600">Unable to load profile information at this time.</p>
        ) : (
          <p className="ml-4 mt-2 text-lg text-gray-600">
            {user?.username} is an active member of the Skivvy community, having joined in {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'recently'}. 
            They are passionate about skill sharing and learning, and are always looking for opportunities to both teach and learn from others in the community. 
            Connect with {user?.username} to explore potential skill exchanges and collaborations!
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
