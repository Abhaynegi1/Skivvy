import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Funnel,
  Search,
  Star,
  Clock,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Home,
  BookOpen,
  User,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import People from "./People";
import { motion } from "framer-motion";
import { authAPI } from "../utils/api";

const Explore = () => {
  const navigate = useNavigate();

  const popularSkills = [
    "Web Development",
    "Programming",
    "Graphic designing",
    "Video editing",
    "Writing",
  ];

  // Loaded profiles from backend
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    offered: [], // array of skills
    seeking: [], // array of skills
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [offeredQuery, setOfferedQuery] = useState("");
  const [seekingQuery, setSeekingQuery] = useState("");

  const TALENTS_PER_PAGE = 5;

  // Sort profiles based on current sort criteria
  const sortedProfiles = useMemo(() => {
    let sorted = [...profiles];

    sorted.sort((a, b) => {
      const aValue = (a.name || '').toLowerCase();
      const bValue = (b.name || '').toLowerCase();
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [profiles, sortBy, sortOrder]);

  // Load current user (to hide their own card)
  useEffect(() => {
    (async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const resp = await authAPI.getProfile();
          if (resp?.success) setCurrentUser(resp.user);
        }
      } catch {}
    })();
  }, []);

  // Exclude current user from list
  const visibleProfiles = useMemo(() => {
    const selfName = currentUser?.displayName || currentUser?.username || "";
    let list = sortedProfiles.filter(p => p.name !== selfName);

    // Apply skill filters (OR within each group)
    if ((filters.offered || []).length > 0) {
      list = list.filter(p =>
        Array.isArray(p.skillsOffered) && p.skillsOffered.some(s => filters.offered.includes(s))
      );
    }
    if ((filters.seeking || []).length > 0) {
      list = list.filter(p =>
        Array.isArray(p.skillsWantToLearn) && p.skillsWantToLearn.some(s => filters.seeking.includes(s))
      );
    }

    return list;
  }, [sortedProfiles, currentUser, filters]);

  // Calculate pagination values
  const totalPages = Math.ceil(visibleProfiles.length / TALENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * TALENTS_PER_PAGE;
  const endIndex = startIndex + TALENTS_PER_PAGE;
  const currentProfiles = visibleProfiles.slice(startIndex, endIndex);

  // Reset to first page when profiles or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder]);

  // Fetch users from backend
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await authAPI.listUsers();
        if (res?.success && Array.isArray(res.users)) {
          const API_BASE_URL = import.meta.env.PROD ? 'https://skivvy-backend.onrender.com' : 'http://localhost:5000';
          const normalized = res.users.map(u => ({
            id: u.id,
            name: u.displayName || u.username,
            bio: u.profile?.bio || '',
            skillsOffered: u.profile?.skillsOffered || [],
            skillsWantToLearn: u.profile?.skillsSeeking || [],
            profileImage: u.profile?.profileImage ? `${API_BASE_URL}${u.profile.profileImage}` : null,
            username: u.username,
          }));
          setProfiles(normalized);
        } else {
          setProfiles([]);
        }
      } catch (e) {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Handles sorting change
   */
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
    setIsDropdownOpen(false);
  };

  /**
   * Handles dropdown option selection
   */
  const handleDropdownSelect = (value) => {
    handleSortChange(value);
  };

  /**
   * Handles page change
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({ offered: [], seeking: [] });
    setOfferedQuery("");
    setSeekingQuery("");
  };

  /**
   * Generates page numbers for pagination
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handleGotoPeople = (profile) => {
    navigate(`/u/${profile.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Area */}
      <div className="w-full px-4 py-6 pt-24">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Filter Sidebar (sticky) */}

          <div className="w-full rounded-3xl lg:w-1/4 sticky top-4 self-start">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card/70 backdrop:blur-lg rounded-3xl shadow-lg p-6">
                {/* Filter Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-background rounded-xl">
                    <Funnel className="w-5 h-5 text-card-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    Filters
                  </h3>
                </div>

                {/* Skills Offered Filter */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-text-primary" />
                    <h4 className="text-sm font-medium text-text-primary">Skills Offered</h4>
                  </div>
                  <input
                    value={offeredQuery}
                    onChange={(e) => setOfferedQuery(e.target.value)}
                    placeholder="Search skills..."
                    className="w-full mb-2 px-3 py-2 border text-primary-foreground rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {popularSkills
                      .filter(s => s.toLowerCase().includes(offeredQuery.toLowerCase()))
                      .map((skill) => (
                        <label key={skill} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.offered.includes(skill)}
                            onChange={(e) => {
                              setFilters(prev => ({
                                ...prev,
                                offered: e.target.checked
                                  ? [...prev.offered, skill]
                                  : prev.offered.filter(s => s !== skill)
                              }));
                            }}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-text-primary">{skill}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Skills Seeking Filter */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-text-primary" />
                    <h4 className="text-sm font-medium text-text-primary">Skills Seeking</h4>
                  </div>
                  <input
                    value={seekingQuery}
                    onChange={(e) => setSeekingQuery(e.target.value)}
                    placeholder="Search skills..."
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {popularSkills
                      .filter(s => s.toLowerCase().includes(seekingQuery.toLowerCase()))
                      .map((skill) => (
                        <label key={skill} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.seeking.includes(skill)}
                            onChange={(e) => {
                              setFilters(prev => ({
                                ...prev,
                                seeking: e.target.checked
                                  ? [...prev.seeking, skill]
                                  : prev.seeking.filter(s => s !== skill)
                              }));
                            }}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-text-primary">{skill}</span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Profile Listings */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card/70 backdrop:blur-lg rounded-3xl p-3 mb-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-text-primary">
                      Sort by:
                    </label>

                    {/* Custom Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-32 px-3 py-2 text-sm font-medium text-text-secondary bg-card border border-gray-300 rounded-xl shadow-sm hover:bg-background focus:outline-none focus:ring-2 focus:ring-card-foreground focus:border-card-foreground transition-all duration-200"
                      >
                        <span className="capitalize">{sortBy}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-card rounded-md shadow-lg animate-in slide-in-from-top-2 duration-200">
                          <div className="py-1">
                            {[
                              { value: "name", label: "Name" },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() =>
                                  handleDropdownSelect(option.value)
                                }
                                className={`w-full px-3 py-2 text-sm text-left hover:bg-background transition-colors duration-150 ${
                                  sortBy === option.value
                                    ? "bg-card text-text-secondary font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="px-3 py-1.5 text-text-secondary hover:text-text-secondary hover:bg-background border border-gray-300 rounded-full transition-all duration-200 flex items-center gap-1"
                      title={`Sort ${
                        sortOrder === "asc" ? "Descending" : "Ascending"
                      }`}
                    >
                      <span className="text-sm font-medium">{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
                      <span className="text-lg">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {visibleProfiles.length} talents found
                  </div>
                </div>
              </div>
            </motion.div>

            {/* No Results Message */}
            {visibleProfiles.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  No talents found
                </div>
                <p className="text-gray-400">
                  Try adjusting your search criteria or filters to find more
                  talents.
                </p>
              </div>
            )}

            {/* Profile Cards List */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="space-y-3">
                {currentProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => handleGotoPeople(profile)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleGotoPeople(profile); }}
                    className="bg-card/70 backdrop:blue-lg rounded-3xl shadow-sm  p-6 hover:shadow-md transition-shadow cursor-pointer"
                    aria-label={`Open ${profile.name}'s profile`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 ring-2 ring-orange-200">
                        {profile.profileImage ? (
                          <img src={profile.profileImage} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-white font-bold">
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-text-primary mb-1">
                              {profile.name}
                            </h4>
                            {/* Location removed */}
                          </div>
                        </div>

                        {/* Bio */}
                        <div className="mb-4">
                          <p className="text-sm text-secondary-foreground leading-relaxed">
                            {profile.bio}
                          </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              SKILLS OFFERED
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.skillsOffered.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              WANT TO LEARN
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.skillsWantToLearn.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center mt-4 space-y-3">
                {/* Page Numbers */}
                <div className="flex flex-wrap justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 border border-gray-300 cursor-not-allowed"
                        : "text-orange-600 border border-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded transition-colors ${
                        page === currentPage
                          ? "bg-orange-600 text-white"
                          : "text-orange-600 border border-orange-600 hover:bg-orange-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 border border-gray-300 cursor-not-allowed"
                        : "text-orange-600 border border-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} ({visibleProfiles.length} total results)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
