import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Menu, X, Sun, Moon } from "lucide-react";
import { authAPI } from "../utils/api";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  const [theme, setTheme] = useState("light");

  const API_BASE_URL = import.meta.env.PROD
    ? "https://skivvy-backend.onrender.com"
    : "http://localhost:5000";

  const getAvatarSrc = () => {
    const img = user?.profile?.profileImage;
    if (!img) return null;
    // Cloudinary URLs are full URLs, local paths need base URL
    return img.startsWith("http://") || img.startsWith("https://") ? img : `${API_BASE_URL}${img}`;
  };

  // 🌙 Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // 🌙 Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // 🔒 Auth check
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("user");
        return;
      }

      setLoading(true);
      try {
        const response = await authAPI.getProfile();
        if (response.unauthorized || !response.success) {
          setIsAuthenticated(false);
          setUser(null);
          authAPI.logout();
        } else if (response.success) {
          setIsAuthenticated(true);
          setUser(response.user);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsAuthenticated(false);
        setUser(null);
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

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

  const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] z-50 transition-all duration-500
        ${scrolled
          ? "bg-white/60 dark:bg-black/40 backdrop-blur-lg shadow-lg rounded-2xl py-2 px-6 scale-95"
          : "bg-transparent py-4 px-6"
        }`}
    >
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/home"
          className="text-3xl font-bold text-orange-400 tracking-wide"
        >
          Skivvy
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-8 items-center">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={`/${link.id}`}
                  className="hover:text-primary-accent duration-200 font-medium"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* 🌙 Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full hover:bg-surface/50 transition-colors"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-primary-accent" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>

          {/* Profile / Auth */}
          {isAuthenticated ? (
            <div className="relative profile-dropdown ml-3">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center gap-3 bg-primary-accent/10 hover:bg-primary-accent/20 duration-300 text-primary-accent py-1.5 pl-1.5 pr-3 font-semibold rounded-2xl"
              >
                {getAvatarSrc() ? (
                  <img
                    src={getAvatarSrc()}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary-accent/20 text-primary-accent grid place-items-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {loading ? "Loading..." : (user?.displayName || user?.username || "User")}
                </span>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border py-2 z-50">
                  <button
                    onClick={() => {
                      navigate("/Profile");
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-background"
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-background"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3 ml-3">
              <button
                onClick={() => navigate("/signup")}
                className="bg-primary-accent hover:bg-surface hover:text-primary-accent duration-300 text-orange-300 py-2 px-4 font-bold rounded-2xl"
              >
                Sign up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-secondary-accent/10 hover:bg-surface text-secondary-accent duration-300 font-bold py-2 px-4 rounded-2xl"
              >
                Login
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary-accent focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
    </header>
  );
};

export default Header;
