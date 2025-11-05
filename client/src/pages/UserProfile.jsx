import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";
import { User, MapPin, Camera, ArrowLeft, MessageCircle } from "lucide-react";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.PROD
    ? 'https://skivvy-backend.onrender.com'
    : 'http://localhost:5000';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await authAPI.getUserById(id);
        if (resp?.success) {
          setUser(resp.user);
        } else {
          setError(resp?.message || 'Failed to load user');
        }
      } catch (e) {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center">
        <div className="text-gray-700">Loading profile…</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center">
        <div className="text-red-600">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="bg-orange-100 min-h-screen p-4 gap-6 grid grid-cols-4 place-items-stretch mt-20">
      {/* LEFT SIDEBAR */}
      <div className="bg-white row-span-5 rounded-3xl shadow-lg relative">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-36 h-36 my-4 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden ring-2 ring-orange-200">
            {user.profile?.profileImage ? (
              <img
                src={`${API_BASE_URL}${user.profile.profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-orange-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{user.displayName || user.username}</h2>
          <p className="text-sm text-gray-600">@{user.username}</p>
          {user.profile?.location && (
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {user.profile.location}
            </p>
          )}

          {/* Skills Offered */}
          <div className="w-full px-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills Offered</h3>
            <div className="flex flex-wrap gap-2">
              {(user.profile?.skillsOffered || []).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm border border-orange-200">{s}</span>
              ))}
            </div>
          </div>

          {/* Skills Seeking */}
          <div className="w-full px-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills Seeking</h3>
            <div className="flex flex-wrap gap-2">
              {(user.profile?.skillsSeeking || []).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm border border-blue-200">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="col-span-3 flex items-center justify-end gap-3 self-start">
        <button
          onClick={() => navigate('/learn')}
          className="px-5 py-2.5 bg-gray-100 hover:bg-white text-gray-800 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => navigate(`/chat/${user.id}`)}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Chat
        </button>
      </div>

      {/* SUMMARY */}
      <div className="bg-white col-span-3 rounded-3xl shadow-lg p-4 self-start">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">About {user.displayName || user.username}</h1>
        <p className="text-lg text-gray-700 leading-relaxed">{user.profile?.bio || 'No bio provided.'}</p>
      </div>

      {/* FEATURED WORK / PORTFOLIO */}
      <div className="bg-white rounded-3xl col-span-3 row-span-2 shadow-lg">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Featured Work</h3>
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-gray-400" />
                <p className="text-gray-500 text-base">Their latest posts</p>
              </div>
            </div>
          </div>

          {user.portfolio && user.portfolio.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {user.portfolio.map((item) => (
                  <div key={item._id} className="bg-orange-50 rounded-lg overflow-hidden shadow-sm">
                    <div className="relative w-full aspect-square">
                      <img
                        src={`${API_BASE_URL}${item.image}`}
                        alt={item.caption || 'Portfolio item'}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    {item.caption && (
                      <div className="p-3 border-t border-orange-100 bg-white">
                        <p className="text-sm font-medium text-gray-800">{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Camera className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;


