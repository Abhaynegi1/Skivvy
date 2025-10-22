import React, { useState, useEffect, useMemo, useRef } from "react";
import { Funnel, Search, Star, Clock, Filter, SortAsc, SortDesc, X, Home, BookOpen, User, MapPin, ChevronDown } from "lucide-react";

const Explore = () => {
  const skills = [
    "Web Development",
    "Writing",
    "Graphic designing",
    "Programming",
    "Gaming",
    "Guitar",
    "Singing",
    "Video editing",
  ];

  // Profiles data with bio and additional info
  const profiles = [
    { 
      id: 1,
      name: "Alex Johnson", 
      bio: "Passionate web developer with 5 years of experience in React and Node.js. Love teaching others and learning new technologies. Always excited to share knowledge and help beginners start their coding journey.",
      skillsOffered: ["Web Development", "JavaScript"], 
      skillsWantToLearn: ["Machine Learning", "DevOps"], 
      rating: 4.2, 
      duration: 1,
      location: "New York",
      profileImage: null
    },
    { 
      id: 2,
      name: "Sarah Chen", 
      bio: "Creative graphic designer and video editor with a passion for visual storytelling. I specialize in Adobe Creative Suite and love helping others discover their creative potential through design.",
      skillsOffered: ["Video editing", "Graphic designing"], 
      skillsWantToLearn: ["Web Development", "3D Modeling"], 
      rating: 3.8, 
      duration: 3,
      location: "San Francisco",
      profileImage: null
    },
    { 
      id: 3,
      name: "Mike Rodriguez", 
      bio: "Full-stack developer and gaming enthusiast. I've been coding for 8 years and love building web applications. Currently learning game development and always happy to mentor new developers.",
      skillsOffered: ["Web Development", "Programming"], 
      skillsWantToLearn: ["Game Development", "Mobile Apps"], 
      rating: 4.9, 
      duration: 6,
      location: "Austin",
      profileImage: null
    },
    { 
      id: 4,
      name: "Emma Wilson", 
      bio: "Content writer and singer with a love for creative expression. I help businesses tell their stories through compelling content and enjoy teaching others the art of effective communication.",
      skillsOffered: ["Writing", "Content Creation"], 
      skillsWantToLearn: ["Public Speaking", "Marketing"], 
      rating: 2.5, 
      duration: 12,
      location: "Seattle",
      profileImage: null
    },
    { 
      id: 5,
      name: "David Kim", 
      bio: "UI/UX designer and programming instructor. I create beautiful user experiences and love teaching design principles. Always excited to learn new design tools and share knowledge with the community.",
      skillsOffered: ["Graphic designing", "UI/UX Design"], 
      skillsWantToLearn: ["Programming", "Data Visualization"], 
      rating: 4.5, 
      duration: 9,
      location: "Los Angeles",
      profileImage: null
    },
  ];

  // Filter states
  const [filters, setFilters] = useState({
    feeRange: '',
    schoolType: '',
    gender: '',
    curriculum: '',
    rating: ''
  });
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const TALENTS_PER_PAGE = 5;

  // Sort profiles based on current sort criteria
  const sortedProfiles = useMemo(() => {
    let sorted = [...profiles];
    
    sorted.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'experience':
          aValue = a.duration;
          bValue = b.duration;
          break;
        default:
          aValue = a.rating;
          bValue = b.rating;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [sortBy, sortOrder]);

  // Calculate pagination values
  const totalPages = Math.ceil(sortedProfiles.length / TALENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * TALENTS_PER_PAGE;
  const endIndex = startIndex + TALENTS_PER_PAGE;
  const currentProfiles = sortedProfiles.slice(startIndex, endIndex);

  // Reset to first page when profiles or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Handles sorting change
   */
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      feeRange: '',
      schoolType: '',
      gender: '',
      curriculum: '',
      rating: ''
    });
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
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="w-full px-4 py-6 pt-24">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Filter Sidebar (sticky) */}
          <div className="w-full lg:w-1/4 sticky top-4 self-start">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Filter Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Funnel className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>


              {/* Skills Filter */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                  <h4 className="text-sm font-medium text-gray-700">Skills</h4>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {skills.map((skill) => (
                    <label key={skill} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Minimum Rating Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-gray-600" />
                  <h4 className="text-sm font-medium text-gray-700">Minimum Rating</h4>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      defaultChecked
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">★★★★☆ 4+ Stars</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">★★★☆☆ 3+ Stars</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">★★☆☆☆ 2+ Stars</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">★☆☆☆☆ 1+ Stars</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Listings */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700">Sort by:</label>
                  
                  {/* Custom Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center justify-between w-32 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    >
                      <span className="capitalize">
                        {sortBy === 'experience' ? 'Experience' : sortBy}
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg animate-in slide-in-from-top-2 duration-200">
                        <div className="py-1">
                          {[
                            { value: 'name', label: 'Name' },
                            { value: 'rating', label: 'Rating' },
                            { value: 'experience', label: 'Experience' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleDropdownSelect(option.value)}
                              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-150 ${
                                sortBy === option.value 
                                  ? 'bg-orange-50 text-orange-700 font-medium' 
                                  : 'text-gray-700'
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
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300 rounded-md transition-all duration-200 flex items-center gap-1"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <span className="text-sm font-medium">
                      {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </span>
                    <span className="text-lg">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {sortedProfiles.length} talents found
                </div>
              </div>
            </div>

            {/* No Results Message */}
            {sortedProfiles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No talents found</div>
                <p className="text-gray-400">
                  Try adjusting your search criteria or filters to find more talents.
                </p>
              </div>
            )}

            {/* Profile Cards List */}
            <div className="space-y-3">
              {currentProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Profile Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                      <span className="text-white font-bold text-lg">
                        {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                      {/* Rating Badge */}
                      <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {profile.rating}
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {profile.name}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {profile.bio}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">SKILLS OFFERED</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {profile.skillsOffered.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">WANT TO LEARN</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {profile.skillsWantToLearn.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
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
                        ? 'text-gray-400 border border-gray-300 cursor-not-allowed'
                        : 'text-orange-600 border border-orange-600 hover:bg-orange-50'
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
                          ? 'bg-orange-600 text-white'
                          : 'text-orange-600 border border-orange-600 hover:bg-orange-50'
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
                        ? 'text-gray-400 border border-gray-300 cursor-not-allowed'
                        : 'text-orange-600 border border-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} ({sortedProfiles.length} total results)
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