import React, { useState, useEffect } from "react";
import {
  Camera,
  Code,
  PenTool,
  Music2,
  BookOpenText,
  Book,
  User,
  MapPin,
  Plus,
  X,
  Check,
  ArrowRight,
  Edit3,
  Upload,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { authAPI } from "../utils/api";
import { useToast } from "../components/Toast";
import SkillsPicker from "../components/SkillsPicker";
import { useNavigate, useLocation } from "react-router-dom";
import ProfilePictureUpload from "../components/ProfilePictureUpload";

const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [isEditingBioTop, setIsEditingBioTop] = useState(false);
  const [bioDraftTop, setBioDraftTop] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [captionModalOpen, setCaptionModalOpen] = useState(false);
  const [captionDraft, setCaptionDraft] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const { show } = useToast();
  const allSkills = [
    "Web Development",
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "UI/UX",
    "Graphic Design",
    "Branding",
    "Guitar",
    "Music Theory",
    "Singing",
    "Songwriting",
    "Photography",
    "Video Editing",
    "Writing",
    "Editing",
    "Storytelling",
    "Marketing",
    "Public Speaking",
    "Fitness Coaching",
    "Nutrition",
    "Yoga",
    "Languages",
    "Cooking",
    "Data Science",
    "Python",
    "C++",
    "Java",
    "SQL",
  ];
  const [showSkillsOffered, setShowSkillsOffered] = useState(false);
  const [showSkillsSeeking, setShowSkillsSeeking] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Check if user is authenticated (basic) then validate with API
      if (!authAPI.isAuthenticated()) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await authAPI.getProfile();
        if (response.unauthorized) {
          // Token invalid/expired. Clear and redirect to login.
          authAPI.logout();
          navigate("/login");
          return;
        }
        if (response.success) {
          setUser(response.user);
          setEditFormData({
            displayName: response.user.displayName || "",
            bio: response.user.profile?.bio || "",
            location: response.user.profile?.location || "",
          });
          const bio = response.user.profile?.bio || "";
          setBioDraftTop(bio);
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, location.pathname]);

  const startEditCaption = (item) => {
    setEditingItemId(item._id);
    setCaptionDraft(item.caption || "");
    setCaptionModalOpen(true);
  };

  const handleSaveCaption = async () => {
    if (!editingItemId) return;
    const resp = await authAPI.updatePortfolioCaption(
      editingItemId,
      captionDraft
    );
    if (resp?.success) {
      setCaptionModalOpen(false);
      show({ type: "success", title: "Updated", message: "Caption updated" });
      // Refresh profile data
      const updated = await authAPI.getProfile();
      if (updated.success) setUser(updated.user);
    } else {
      show({
        type: "error",
        title: "Update failed",
        message: resp?.message || "Failed to update caption",
      });
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
      show({ type: "success", title: "Deleted", message: "Post deleted" });
      // Refresh profile data
      const updated = await authAPI.getProfile();
      if (updated.success) setUser(updated.user);
    } else {
      show({
        type: "error",
        title: "Delete failed",
        message: resp?.message || "Failed to delete",
      });
    }
  };

  const handleProfilePictureConfirm = async (croppedBlob) => {
    setUploading(true);
    try {
      const response = await authAPI.uploadProfilePicture(croppedBlob);
      if (response.success) {
        // Update user state with new profile image
        setUser((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            profileImage: response.profileImage,
          },
        }));
        // Update localStorage
        const updatedUser = {
          ...user,
          profile: { ...user.profile, profileImage: response.profileImage },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        show({
          type: "error",
          title: "Upload failed",
          message: "Failed to upload profile picture",
        });
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      show({
        type: "error",
        title: "Upload error",
        message: "Error uploading profile picture",
      });
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
        localStorage.setItem("user", JSON.stringify(response.user));
        setShowEditModal(false);
      } else {
        show({
          type: "error",
          title: "Update failed",
          message: "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      show({
        type: "error",
        title: "Update error",
        message: "Error updating profile",
      });
    } finally {
      setSaving(false);
    }
  };

  // Inline bio editing helpers for top section
  const startBioEditTop = () => {
    setBioDraftTop((user?.profile?.bio || "").slice(0, 150));
    setIsEditingBioTop(true);
  };

  const cancelBioEditTop = () => {
    setBioDraftTop(user?.profile?.bio || "");
    setIsEditingBioTop(false);
  };

  const saveBioEditTop = async () => {
    const trimmed = (bioDraftTop || "").slice(0, 150).trim();
    setSavingBio(true);
    try {
      const response = await authAPI.updateProfile({ bio: trimmed });
      if (response.success) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        setIsEditingBioTop(false);
      } else {
        show({
          type: "error",
          title: "Update failed",
          message: "Failed to update bio",
        });
      }
    } catch (e) {
      console.error("Error updating bio:", e);
      show({
        type: "error",
        title: "Update error",
        message: "Error updating bio",
      });
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
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Error Loading Profile
          </h2>
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
  const profileImageSrc = user.profile?.profileImage
    ? user.profile.profileImage.startsWith('http://') || user.profile.profileImage.startsWith('https://')
      ? user.profile.profileImage
      : `${import.meta.env.PROD ? "https://skivvy-backend.onrender.com" : "http://localhost:5000"}${user.profile.profileImage}`
    : null;

  const portfolioImageSrc = (image) => {
    if (!image) return '';
    return image.startsWith('http://') || image.startsWith('https://')
      ? image
      : `${import.meta.env.PROD ? "https://skivvy-backend.onrender.com" : "http://localhost:5000"}${image}`;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.16)_0%,_rgba(255,247,237,0.92)_34%,_#fff8ef_72%,_#fffdf9_100%)] pb-10 pt-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 rounded-[1.75rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_60px_-36px_rgba(251,146,60,0.32)] backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <button
                onClick={() => setShowProfilePictureModal(true)}
                className="group relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-orange-100 bg-orange-50 shadow-lg transition-transform hover:-translate-y-0.5 sm:h-36 sm:w-36"
              >
                {uploading ? (
                  <div className="text-center">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
                    <span className="text-xs font-medium text-orange-700">Uploading</span>
                  </div>
                ) : profileImageSrc ? (
                  <img
                    src={profileImageSrc}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <User className="mx-auto mb-2 h-14 w-14 text-orange-500" />
                    <span className="text-sm font-semibold text-orange-700">Add Photo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </button>

              <div className="max-w-xl">
                <p className="mb-2 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                  Profile overview
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {user.displayName || user.username}
                </h1>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  @{user.username}
                  {user.profile?.location && (
                    <span className="ml-3 inline-flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {user.profile.location}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:min-w-[290px]">
              <div className="rounded-2xl border border-orange-100 bg-white px-3 py-2.5 text-center shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Offered</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{(user.profile?.skillsOffered || []).length}</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-white px-3 py-2.5 text-center shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Seeking</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{(user.profile?.skillsSeeking || []).length}</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white px-3 py-2.5 text-center shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Work</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{user.portfolio?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] xl:gap-6">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-[0_18px_60px_-36px_rgba(251,146,60,0.45)] backdrop-blur">
              <div className="mb-4">
                <h2 className="text-base font-bold text-gray-900">About</h2>
                <p className="mt-1 text-xs text-gray-500">A quick snapshot of who you are.</p>
              </div>

              {isEditingBioTop ? (
                <div>
                  <textarea
                    value={bioDraftTop}
                    onChange={(e) => setBioDraftTop(e.target.value.slice(0, 150))}
                    placeholder="Tell others about yourself..."
                    className="min-h-[110px] w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-3.5 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    rows={4}
                    maxLength={150}
                  />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">{bioDraftTop.length}/150 characters</p>
                    <div className="flex gap-2">
                      <button
                        onClick={cancelBioEditTop}
                        className="rounded-xl border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveBioEditTop}
                        disabled={savingBio}
                        className="rounded-xl bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                      >
                        {savingBio ? "Saving..." : "Save Bio"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : user.profile?.bio ? (
                <div className="space-y-3">
                  <p className="text-sm leading-6 text-gray-700">{user.profile.bio}</p>
                  <button
                    onClick={startBioEditTop}
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Bio
                  </button>
                </div>
              ) : (
                <div className="space-y-3 rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 p-4 text-center">
                  <p className="text-sm text-gray-600">Tell others about yourself</p>
                  <button
                    onClick={startBioEditTop}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Add Bio
                  </button>
                </div>
              )}
            </section>

            <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-[0_18px_60px_-36px_rgba(251,146,60,0.45)] backdrop-blur">
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Skills Offered</h2>
                  <p className="text-xs text-gray-500">What you can teach.</p>
                </div>
                <PenTool className="h-4.5 w-4.5 text-orange-500" />
              </div>
              <div className="flex flex-wrap gap-2">
                {(user.profile?.skillsOffered || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 p-3.5 text-center">
                <p className="mb-3 text-sm font-medium text-gray-600">What can you teach others?</p>
                <button
                  onClick={() => setShowSkillsOffered(true)}
                  className="rounded-xl border border-orange-300 px-3.5 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                >
                  {(user.profile?.skillsOffered || []).length > 0 ? "Edit Skills" : "Add Skills"}
                </button>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-[0_18px_60px_-36px_rgba(59,130,246,0.28)] backdrop-blur">
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Skills Seeking</h2>
                  <p className="text-xs text-gray-500">What you want to learn.</p>
                </div>
                <Book className="h-4.5 w-4.5 text-blue-500" />
              </div>
              <div className="flex flex-wrap gap-2">
                {(user.profile?.skillsSeeking || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-3.5 text-center">
                <p className="mb-3 text-sm font-medium text-gray-600">What do you want to learn?</p>
                <button
                  onClick={() => setShowSkillsSeeking(true)}
                  className="rounded-xl border border-blue-300 px-3.5 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  {(user.profile?.skillsSeeking || []).length > 0 ? "Edit Skills" : "Add Skills"}
                </button>
              </div>
            </section>
          </aside>

          <main className="space-y-5">
            <section className="rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-[0_18px_60px_-36px_rgba(251,146,60,0.45)] backdrop-blur md:p-5">
              <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Featured Work</h3>
                  <p className="mt-1 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                    <Camera className="h-3.5 w-3.5" />
                    Showcase your best work.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/portfolio/upload")}
                  className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-orange-50 px-3.5 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Add Portfolio
                </button>
              </div>

              {user.portfolio && user.portfolio.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {user.portfolio.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="group overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setLightboxItem(item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setLightboxItem(item);
                        }}
                        className="relative aspect-[16/11] cursor-pointer overflow-hidden bg-orange-50 focus:outline-none"
                      >
                        <img
                          src={portfolioImageSrc(item.image)}
                          alt={item.caption || "Portfolio item"}
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        <div className="absolute right-3 top-3">
                          <button
                            onClick={() =>
                              setMenuOpenId(
                                menuOpenId === (item._id || index) ? null : item._id || index
                              )
                            }
                            className="rounded-full border border-white/70 bg-white/95 p-2 shadow-lg transition hover:bg-white"
                            aria-label="Open post menu"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-700" />
                          </button>
                          {menuOpenId === (item._id || index) && (
                            <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                              <button
                                onClick={() => {
                                  setMenuOpenId(null);
                                  startEditCaption(item);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                              >
                                <Edit3 className="h-4 w-4" />
                                Edit caption
                              </button>
                              <button
                                onClick={() => requestDeleteItem(item)}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete post
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {item.caption && (
                        <div className="border-t border-gray-100 p-3.5">
                          <p className="line-clamp-2 text-sm font-medium leading-5 text-gray-800">
                            {item.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex min-h-[280px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-gray-200 bg-gray-50/70 px-6 text-center">
                  <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
                    <Camera className="h-10 w-10 text-gray-300" />
                  </div>
                  <p className="text-base font-semibold text-gray-700">No portfolio items yet</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Add a few projects to make the page feel complete and give visitors something concrete to click.
                  </p>
                  <button
                    onClick={() => navigate("/portfolio/upload")}
                    className="mt-5 rounded-xl bg-orange-500 px-4.5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Add Portfolio
                  </button>
                </div>
              )}
            </section>
          </main>
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProfile();
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.displayName}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                        }))
                      }
                      placeholder="Your display name (optional)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This is how others will see your name
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={editFormData.bio}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Tell others about yourself..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                      maxLength={150}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editFormData.bio.length}/150 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={editFormData.location}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
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
                    {saving ? "Saving..." : "Save Changes"}
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
                <button
                  onClick={() => setCaptionModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete post?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone.
              </p>
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
                src={lightboxItem.image?.startsWith('http://') || lightboxItem.image?.startsWith('https://') 
                  ? lightboxItem.image 
                  : `${import.meta.env.PROD ? "https://skivvy-backend.onrender.com" : "http://localhost:5000"}${lightboxItem.image}`}
                alt={lightboxItem.caption || "Post"}
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
                <p className="text-gray-800 text-base leading-relaxed">
                  {lightboxItem.caption}
                </p>
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
              setUser((prev) => ({
                ...prev,
                ...resp.user,
                portfolio: resp.user?.portfolio ?? prev?.portfolio,
              }));
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...user,
                  ...resp.user,
                  portfolio: resp.user?.portfolio ?? user?.portfolio,
                })
              );
              show({
                type: "success",
                title: "Updated",
                message: "Skills Offered updated",
              });
            } else {
              show({
                type: "error",
                title: "Update failed",
                message: resp?.message || "Could not save skills",
              });
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
              setUser((prev) => ({
                ...prev,
                ...resp.user,
                portfolio: resp.user?.portfolio ?? prev?.portfolio,
              }));
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...user,
                  ...resp.user,
                  portfolio: resp.user?.portfolio ?? user?.portfolio,
                })
              );
              show({
                type: "success",
                title: "Updated",
                message: "Skills Seeking updated",
              });
            } else {
              show({
                type: "error",
                title: "Update failed",
                message: resp?.message || "Could not save skills",
              });
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
