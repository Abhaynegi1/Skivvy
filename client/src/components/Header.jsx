import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { authAPI } from "../utils/api";
const Header = () => {
  const navLinks = [
    {id: "teach", title: "Teach"},
    {id: "learn", title:"Learn"},
    {id:"community", title:"Community"}
  ]

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check authentication status and fetch user data
    const checkAuthStatus = async () => {
      const authenticated = authAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setLoading(true);
        try {
          // Fetch fresh user data from backend
          const response = await authAPI.getProfile();
          if (response.success) {
            setUser(response.user);
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            // If profile fetch fails, use cached data as fallback
            const cachedUser = authAPI.getCurrentUser();
            setUser(cachedUser);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Use cached data as fallback
          const cachedUser = authAPI.getCurrentUser();
          setUser(cachedUser);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/');
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };



  return (
    <nav className="flex items-center justify-between p-5 bg-white px-10">
      <Link className="text-3xl font-bold text-orange-400" to="/home">Skivvy</Link>
      <ul className="flex gap-8 items-center">
        {navLinks.map((link) => (
          <li key={link.id}>
            <Link to={`/${link.id}`}>{link.title}</Link>
          </li>
        ))}
        {isAuthenticated ? (
          // Profile dropdown for authenticated users
          <div className="relative profile-dropdown">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 duration-300 text-orange-600 py-2 px-4 font-semibold rounded-2xl"
            >
              <User className="w-5 h-5" />
              <span>
                {loading ? 'Loading...' : (user?.username || 'Profile')}
              </span>
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {loading ? 'Loading...' : (user?.username || 'User')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {loading ? 'Please wait...' : (user?.email || 'No email')}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    navigate('/Profile');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Auth buttons for non-authenticated users
          <div className="flex gap-3">
            <button onClick={()=>navigate('/signup')} className="bg-orange-400 hover:bg-white hover:text-orange-400 duration-300 text-white py-2 px-4 font-bold rounded-2xl">Sign up</button>
            <button onClick={()=>navigate('/login')} className="bg-blue-100 hover:text-orange-400 duration-300 hover:bg-white font-bold py-2 px-4 rounded-2xl">Login</button>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Header;
