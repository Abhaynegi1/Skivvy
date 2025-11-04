import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Menu, X } from "lucide-react";
import { authAPI } from "../utils/api";

const Header = () => {
  const navLinks = [
    { id: "learn", title: "Explore" },
    { id: "community", title: "Community" },
  ];

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user data & auth status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      // If no token, clear everything and show login buttons
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user'); // Clear any stale user data
        return;
      }

      // If token exists, validate it with the server
      setLoading(true);
      try {
        const response = await authAPI.getProfile();
        if (response.unauthorized || !response.success) {
          // Token invalid or expired – clear everything and show login buttons
          setIsAuthenticated(false);
          setUser(null);
          authAPI.logout(); // This will clear token and user from localStorage
        } else if (response.success) {
          // Valid token and successful profile fetch
          setIsAuthenticated(true);
          setUser(response.user);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // On error, clear everything and show login buttons
        setIsAuthenticated(false);
        setUser(null);
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfileDropdown && !e.target.closest(".profile-dropdown")) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileDropdown]);

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
    setShowProfileDropdown(false);
    navigate("/");
  };

  const toggleProfileDropdown = () =>
    setShowProfileDropdown(!showProfileDropdown);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-between p-5 px-6 md:px-10">
        {/* Logo */}
        <Link
          to="/home"
          className="text-3xl font-bold text-orange-400 tracking-wide"
        >
          Skivvy
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.id}>
              <Link
                to={`/${link.id}`}
                className="hover:text-orange-400 duration-200 font-medium"
              >
                {link.title}
              </Link>
            </li>
          ))}

          {isAuthenticated ? (
            <div className="relative profile-dropdown">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 duration-300 text-orange-600 py-2 px-4 font-semibold rounded-2xl"
              >
                <User className="w-5 h-5" />
                <span>
                  {loading ? "Loading..." : user?.username || "Profile"}
                </span>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-slideDown">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {loading ? "Loading..." : user?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {loading ? "Please wait..." : user?.email || "No email"}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/Profile");
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
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="bg-orange-400 hover:bg-white hover:text-orange-400 duration-300 text-white py-2 px-4 font-bold rounded-2xl"
              >
                Sign up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-100 hover:text-orange-400 duration-300 hover:bg-white font-bold py-2 px-4 rounded-2xl"
              >
                Login
              </button>
            </div>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-orange-400 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Slide Down Menu */}
      <div
        className={`md:hidden bg-white shadow-inner overflow-hidden transition-all duration-500 ease-in-out ${
          showMobileMenu ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-5 py-5">
          {navLinks.map((link) => (
            <li key={link.id}>
              <Link
                to={`/${link.id}`}
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-700 text-lg hover:text-orange-400 duration-200"
              >
                {link.title}
              </Link>
            </li>
          ))}

          {isAuthenticated ? (
            <>
              <div className="border-t border-gray-200 w-4/5 my-3"></div>
              <button
                onClick={() => navigate("/Profile")}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-400 duration-200"
              >
                <Settings className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-400 duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3 mt-3">
                <button
                  onClick={() => {
                    navigate("/signup");
                    setShowMobileMenu(false);
                  }}
                  className="bg-orange-400 hover:bg-white hover:text-orange-400 duration-300 text-white py-2 px-5 font-bold rounded-2xl"
                >
                  Sign up
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                    setShowMobileMenu(false);
                  }}
                  className="bg-blue-100 hover:text-orange-400 hover:bg-white duration-300 font-bold py-2 px-5 rounded-2xl"
                >
                  Login
                </button>
              </div>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
