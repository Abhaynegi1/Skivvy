import React, { useState, useEffect} from "react";
import { Camera, Code, PenTool, Music2, BookOpenText, Book, User, MapPin, Plus, X, Check, ArrowRight, Edit3, Upload, MoreVertical, Trash2 } from "lucide-react";
import { authAPI } from "../utils/api";
import { useToast } from "../components/Toast";
import SkillsPicker from "../components/SkillsPicker";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [isEditingBioTop, setIsEditingBioTop] = useState(false);
  const [bioDraftTop, setBioDraftTop] = useState('');
  const [savingBio, setSavingBio] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [captionModalOpen, setCaptionModalOpen] = useState(false);
  const [captionDraft, setCaptionDraft] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const { show } = useToast();
  const allSkills = [
    "Web Development","React","Node.js","JavaScript","TypeScript","UI/UX","Graphic Design","Branding","Guitar","Music Theory","Singing","Songwriting","Photography","Video Editing","Writing","Editing","Storytelling","Marketing","Public Speaking","Fitness Coaching","Nutrition","Yoga","Languages","Cooking","Data Science","Python","C++","Java","SQL"
  ];
  const [showSkillsOffered, setShowSkillsOffered] = useState(false);
  const [showSkillsSeeking, setShowSkillsSeeking] = useState(false);


  useEffect(() => {
    const fetchUserProfile = async () => {
      // Check if user is authenticated (basic) then validate with API
      if (!authAPI.isAuthenticated()) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await authAPI.getProfile();
        if (response.unauthorized) {
          // Token invalid/expired. Clear and redirect to login.
          authAPI.logout();
          navigate('/login');
          return;
        }
        if (response.success) {
          setUser(response.user);
          setEditFormData({
            displayName: response.user.displayName || '',
            bio: response.user.profile?.bio || '',
            location: response.user.profile?.location || ''
          });
          const bio = response.user.profile?.bio || '';
          setBioDraftTop(bio);
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
  }, [navigate, location.pathname]);

  const startEditCaption = (item) => {
    setEditingItemId(item._id);
    setCaptionDraft(item.caption || '');
    setCaptionModalOpen(true);
  };

  const handleSaveCaption = async () => {
    if (!editingItemId) return;
    const resp = await authAPI.updatePortfolioCaption(editingItemId, captionDraft);
    if (resp?.success) {
      setCaptionModalOpen(false);
      show({ type: 'success', title: 'Updated', message: 'Caption updated' });
      // Refresh profile data
      const updated = await authAPI.getProfile();
      if (updated.success) setUser(updated.user);
    } else {
      show({ type: 'error', title: 'Update failed', message: resp?.message || 'Failed to update caption' });
    }
  };

  const requestDeleteItem = (item) => {
    setMenuOpenId(null);
    setDeleteItemId(item._id);
    setConfirmOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    setConfirmOpen(false);
    const resp = await authAPI.deletePortfolioItem(deleteItemId);
    if (resp?.success) {
      show({ type: 'success', title: 'Deleted', message: 'Post deleted' });
      // Refresh profile data
      const updated = await authAPI.getProfile();
      if (updated.success) setUser(updated.user);
    } else {
      show({ type: 'error', title: 'Delete failed', message: resp?.message || 'Failed to delete' });
    }
  };

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
              show({ type: 'error', title: 'Upload failed', message: 'Failed to upload profile picture' });
            }
    } catch (error) {
            console.error('Error uploading profile picture:', error);
            show({ type: 'error', title: 'Upload error', message: 'Error uploading profile picture' });
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
              show({ type: 'error', title: 'Update failed', message: 'Failed to update profile' });
            }
    } catch (error) {
            console.error('Error updating profile:', error);
            show({ type: 'error', title: 'Update error', message: 'Error updating profile' });
    } finally {
      setSaving(false);
    }
  };

  // Inline bio editing helpers for top section
  const startBioEditTop = () => {
    setBioDraftTop((user?.profile?.bio || '').slice(0, 150));
    setIsEditingBioTop(true);
  };

  const cancelBioEditTop = () => {
    setBioDraftTop(user?.profile?.bio || '');
    setIsEditingBioTop(false);
  };

  const saveBioEditTop = async () => {
    const trimmed = (bioDraftTop || '').slice(0, 150).trim();
    setSavingBio(true);
    try {
      const response = await authAPI.updateProfile({ bio: trimmed });
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        setIsEditingBioTop(false);
            } else {
               show({ type: 'error', title: 'Update failed', message: 'Failed to update bio' });
            }
    } catch (e) {
           console.error('Error updating bio:', e);
           show({ type: 'error', title: 'Update error', message: 'Error updating bio' });
    } finally {
      setSavingBio(false);
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
    <div className="bg-orange-100 min-h-screen p-4 gap-6 grid grid-cols-4 place-items-stretch mt-20">
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
          <div className="flex flex-wrap gap-2">
            {(user.profile?.skillsOffered || []).map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm border border-orange-200">{skill}</span>
            ))}
          </div>
          <div className="text-center py-4 border-2 border-dashed border-orange-200 rounded-lg">
            <p className="text-gray-500 mb-3 font-medium">What can you teach others?</p>
            <button 
              onClick={() => setShowSkillsOffered(true)}
              className="text-orange-600 hover:text-orange-700 font-medium px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
            >
              {(user.profile?.skillsOffered || []).length > 0 ? 'Edit Skills' : 'Add Skills'}
            </button>
          </div>
        </div>

        {/* Skills Seeking Section */}
        <div className="skills-seeking flex flex-col gap-3 p-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Book className="w-5 h-5 text-blue-500" />
            Skills Seeking
          </h2>
          <div className="flex flex-wrap gap-2">
            {(user.profile?.skillsSeeking || []).map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm border border-blue-200">{skill}</span>
            ))}
          </div>
          <div className="text-center py-4 border-2 border-dashed border-blue-200 rounded-lg">
            <p className="text-gray-500 mb-3 font-medium">What do you want to learn?</p>
            <button 
              onClick={() => setShowSkillsSeeking(true)}
              className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {(user.profile?.skillsSeeking || []).length > 0 ? 'Edit Skills' : 'Add Skills'}
            </button>
          </div>
          </div>
        </div>

      {/* SUMMARY CONTAINER - Top Right */}
      <div className="item2 bg-white col-span-3 rounded-3xl shadow-lg p-4 self-start">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to {user.displayName || user.username}'s Profile</h1>
        {isEditingBioTop ? (
          <div>
            <textarea
              value={bioDraftTop}
              onChange={(e) => setBioDraftTop(e.target.value.slice(0, 150))}
              placeholder="Tell others about yourself..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              maxLength={150}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">{bioDraftTop.length}/150 characters</p>
              <div className="flex gap-2">
                <button
                  onClick={cancelBioEditTop}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBioEditTop}
                  disabled={savingBio}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {savingBio ? 'Saving...' : 'Save Bio'}
                </button>
              </div>
            </div>
          </div>
        ) : user.profile?.bio ? (
          <div className="flex items-start justify-between">
            <p className="text-lg text-gray-700 leading-relaxed flex-1">{user.profile.bio}</p>
            <button
              onClick={startBioEditTop}
              className="ml-4 text-orange-600 hover:text-orange-700 font-medium px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-2">
            <p className="text-gray-500 text-base flex-1">Tell others about yourself</p>
            <button 
              onClick={startBioEditTop}
              className="text-orange-600 hover:text-orange-700 font-medium px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Add Bio
            </button>
            </div>
        )}
        </div>

      {/* FEATURED WORK - Middle Right */}
      <div className="item3 bg-white rounded-3xl col-span-3 row-span-2 shadow-lg">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Featured Work</h3>
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-gray-400" />
                <p className="text-gray-500 text-base">Showcase your best work</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/portfolio/upload')}
              className="text-orange-600 hover:text-orange-700 font-medium px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Add Portfolio
            </button>
        </div>

          {/* Portfolio Items Grid */}
          {user.portfolio && user.portfolio.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {user.portfolio.map((item, index) => (
                  <div key={item._id || index} className="relative bg-orange-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="relative w-full aspect-square focus:outline-none"
                    >
                      <img
                        src={`${import.meta.env.PROD ? 'https://skivvy-backend.onrender.com' : 'http://localhost:5000'}${item.image}`}
                        alt={item.caption || 'Portfolio item'}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Actions menu */}
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === (item._id || index) ? null : (item._id || index))}
                          className="p-2 rounded-full bg-white/90 hover:bg-white shadow border border-gray-200"
                          aria-label="Open post menu"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-700" />
                        </button>
                        {menuOpenId === (item._id || index) && (
                          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button
                              onClick={() => { setMenuOpenId(null); startEditCaption(item); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit caption
                            </button>
                            <button
                              onClick={() => requestDeleteItem(item)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete post
                            </button>
                          </div>
                        )}
                      </div>
                    </button>
                    {item.caption && (
                      <div className="p-4 border-t border-orange-100 bg-white">
                        <p className="text-base font-medium text-gray-800">{item.caption}</p>
                      </div>
                    )}
            </div>
          ))}
        </div>
      </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Camera className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No portfolio items yet</p>
              <p className="text-gray-400 text-sm">Click "Add Portfolio" to showcase your work</p>
            </div>
          )}
        </div>
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
                      maxLength={150}
                    />
                    <p className="text-xs text-gray-500 mt-1">{editFormData.bio.length}/150 characters</p>
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

      {/* Edit Caption Modal */}
      {captionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Edit Caption</h2>
                <button onClick={() => setCaptionModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <textarea
                value={captionDraft}
                onChange={(e) => setCaptionDraft(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setCaptionModalOpen(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCaption}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
      </div>
      </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete post?</h3>
              <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
      </div>
      </div>
        </div>
      )}

      {/* Post Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black">
              <img
                src={`${import.meta.env.PROD ? 'https://skivvy-backend.onrender.com' : 'http://localhost:5000'}${lightboxItem.image}`}
                alt={lightboxItem.caption || 'Post'}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
              <button
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow"
                onClick={() => setLightboxItem(null)}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>
            </div>
            <div className="p-4">
              {lightboxItem.caption ? (
                <p className="text-gray-800 text-base leading-relaxed">{lightboxItem.caption}</p>
              ) : (
                <p className="text-gray-500 text-sm">No caption</p>
              )}
      </div>
      </div>
        </div>
      )}

      {showSkillsOffered && (
        <SkillsPicker
          title="Select up to 5 skills you can teach"
          availableSkills={allSkills}
          initialSelected={user.profile?.skillsOffered || []}
          max={5}
          onCancel={() => setShowSkillsOffered(false)}
          onSave={async (skills) => {
            const resp = await authAPI.updateProfile({ skillsOffered: skills });
            if (resp?.success) {
              setShowSkillsOffered(false);
              setUser(prev => ({ ...prev, ...resp.user, portfolio: resp.user?.portfolio ?? prev?.portfolio }));
              localStorage.setItem('user', JSON.stringify({ ...user, ...resp.user, portfolio: resp.user?.portfolio ?? user?.portfolio }));
              show({ type: 'success', title: 'Updated', message: 'Skills Offered updated' });
            } else {
              show({ type: 'error', title: 'Update failed', message: resp?.message || 'Could not save skills' });
            }
          }}
        />
      )}

      {showSkillsSeeking && (
        <SkillsPicker
          title="Select up to 5 skills you want to learn"
          availableSkills={allSkills}
          initialSelected={user.profile?.skillsSeeking || []}
          max={5}
          onCancel={() => setShowSkillsSeeking(false)}
          onSave={async (skills) => {
            const resp = await authAPI.updateProfile({ skillsSeeking: skills });
            if (resp?.success) {
              setShowSkillsSeeking(false);
              setUser(prev => ({ ...prev, ...resp.user, portfolio: resp.user?.portfolio ?? prev?.portfolio }));
              localStorage.setItem('user', JSON.stringify({ ...user, ...resp.user, portfolio: resp.user?.portfolio ?? user?.portfolio }));
              show({ type: 'success', title: 'Updated', message: 'Skills Seeking updated' });
            } else {
              show({ type: 'error', title: 'Update failed', message: resp?.message || 'Could not save skills' });
            }
          }}
        />
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