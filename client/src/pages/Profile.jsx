import React, { useState, useEffect} from "react";
import { Camera, Code, PenTool, Music2, BookOpenText, Book, User, MapPin, Plus, X, Check, ArrowRight, Edit3, Upload } from "lucide-react";
import { authAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import ProfilePictureUpload from "../components/ProfilePictureUpload";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    bio: '',
    location: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const navigate = useNavigate();


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
          setEditFormData({
            displayName: response.user.displayName || '',
            bio: response.user.profile?.bio || '',
            location: response.user.profile?.location || ''
          });
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

  const handleProfilePictureConfirm = async (croppedBlob) => {
    setUploading(true);
    try {
      const response = await authAPI.uploadProfilePicture(croppedBlob);
      if (response.success) {
        // Update user state with new profile image
        setUser(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            profileImage: response.profileImage
          }
        }));
        // Update localStorage
        const updatedUser = { ...user, profile: { ...user.profile, profileImage: response.profileImage } };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        alert('Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error uploading profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await authAPI.updateProfile(editFormData);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        setShowEditModal(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Always show the profile page, but with completion prompts

  // Improved original grid layout
  return (
    <div className="bg-orange-100 min-h-screen p-4 gap-6 grid grid-cols-4 grid-rows-5 place-items-stretch mt-20">
      {/* PROFILE CONTAINER - Left Sidebar */}
      <div className="item1 bg-white row-span-5 rounded-3xl shadow-lg">
        <div className="profile-container flex flex-col items-center justify-center p-4">
          {/* Profile Picture */}
          <div 
            className="w-36 h-36 my-6 rounded-full bg-orange-100 flex items-center justify-center cursor-pointer hover:bg-orange-200 transition-colors relative shadow-md"
            onClick={() => setShowProfilePictureModal(true)}
          >
            {uploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto mb-1"></div>
                <span className="text-xs text-orange-600">Uploading...</span>
              </div>
            ) : user.profile?.profileImage ? (
              <img 
                src={`${import.meta.env.PROD ? 'https://skivvy-backend.onrender.com' : 'http://localhost:5000'}${user.profile.profileImage}`} 
                alt="Profile" 
                className="w-36 h-36 rounded-full object-cover shadow-md" 
              />
            ) : (
              <div className="text-center">
                <User className="w-16 h-16 text-orange-600 mx-auto mb-2" />
                <span className="text-sm text-orange-600 font-medium">Add Photo</span>
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="text-center mb-4">
            <h4 className="font-bold text-2xl text-gray-800">{user.displayName || user.username}</h4>
            <p className="text-sm text-gray-600 mb-1">@{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.profile?.location && (
              <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.profile.location}
              </p>
            )}
          </div>

        </div>

        {/* Skills Offered Section */}
        <div className="skills-offered flex flex-col gap-3 p-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-orange-500" />
            Skills Offered
          </h2>
          {user.profile?.skillsOffered?.length > 0 ? (
            user.profile.skillsOffered.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg py-3 px-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <PenTool className="text-orange-500 w-4 h-4" />
                <p className="font-medium text-gray-800">{skill}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-lg">
              <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3 font-medium">What can you teach others?</p>
              <button 
                className="text-orange-600 hover:text-orange-700 font-medium px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Add Skills
              </button>
            </div>
          )}
        </div>

        {/* Skills Seeking Section */}
        <div className="skills-seeking flex flex-col gap-3 p-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Book className="w-5 h-5 text-blue-500" />
            Skills Seeking
          </h2>
          {user.profile?.skillsSeeking?.length > 0 ? (
            user.profile.skillsSeeking.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg py-3 px-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Book className="text-blue-500 w-4 h-4" />
                <p className="font-medium text-gray-800">{skill}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-blue-200 rounded-lg">
              <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3 font-medium">What do you want to learn?</p>
              <button 
                className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Add Skills
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY CONTAINER - Top Right */}
      <div className="item2 bg-white col-span-3 rounded-3xl shadow-lg p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to {user.displayName || user.username}'s Profile</h1>
        {user.profile?.bio ? (
          <p className="text-lg text-gray-600 leading-relaxed">{user.profile.bio}</p>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4 text-lg">Tell others about yourself</p>
            <button 
              className="text-orange-600 hover:text-orange-700 font-medium px-6 py-3 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Add Bio
            </button>
          </div>
        )}
      </div>
      
      {/* FEATURED WORK - Middle Right */}
      <div className="item3 bg-white rounded-3xl col-span-3 row-span-3 shadow-lg">
        <div className="p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Featured Work</h3>
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Camera className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4 text-lg">Showcase your best work</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium px-6 py-3 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors">
              Add Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* ABOUT SECTION - Bottom Right */}
      <div className="item4 bg-white rounded-3xl col-span-3 shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About {user.displayName || user.username}</h1>
        {user.profile?.bio ? (
          <p className="text-lg text-gray-600 leading-relaxed">{user.profile.bio}</p>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4 text-lg">Add more details about yourself</p>
            <button 
              className="text-orange-600 hover:text-orange-700 font-medium px-6 py-3 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Complete Profile
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={editFormData.displayName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Your display name (optional)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">This is how others will see your name</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell others about yourself..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{editFormData.bio.length}/500 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={editFormData.location}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Where are you located?"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
      </div>
      </div>
      )}

      {/* Profile Picture Upload Modal */}
      <ProfilePictureUpload
        isOpen={showProfilePictureModal}
        onClose={() => setShowProfilePictureModal(false)}
        onConfirm={handleProfilePictureConfirm}
        currentImage={user.profile?.profileImage}
      />

    </div>
  );
};

export default Profile;