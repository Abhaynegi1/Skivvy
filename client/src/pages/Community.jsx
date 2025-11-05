import React from "react";
import {
  House,
  MessageCircle,
  MessageSquareDot,
  Plus,
  ListCollapse,
} from "lucide-react";
import Profile from "./Profile";
import { motion } from "framer-motion";

const Community = () => {
  const content = null;
  const suggestions = null;
  const buttons = [
    { id: 1, label: "Home", icon: <House /> },
    { id: 2, label: "Messages", icon: <MessageCircle /> },
    { id: 3, label: "Notifications", icon: <MessageSquareDot /> },
    { id: 4, label: "New Post", icon: <Plus /> },
    { id: 5, label: "More", icon: <ListCollapse /> },
  ];
  return (
    <div className="mt-20 flex justify-between h-screen bg-orange-100 w-full">
      {/* SIDEBAR */}
      <div className="sidebar bg-white mt-4 ml-4 h-2/3 rounded-3xl shadow-lg w-1/6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="main-buttons flex flex-col p-4">
            {buttons.map((btn) => (
              <div
                key={btn.id}
                className="button flex items-center mb-4 p-3 bg-gray-200 hover:bg-orange-200 rounded-lg cursor-pointer duration-200"
              >
                <div className="icon mr-2">{btn.icon}</div>
                <div className="label font-semibold text-xl">{btn.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT */}

      <div className="hero bg-white rounded-3xl mt-4 flex justify-center items-center shadow-lg w-3/6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {content ? content : "No content to display yet!"}
        </motion.div>
      </div>
      {/* SUGGESTIONS PANEL */}
      <div className="suggestions w-1/5 bg-white mt-4 mr-4 rounded-3xl shadow-lg p-4 h-2/3 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {suggestions
            ? suggestions
            : "No suggestions available at the moment."}
        </motion.div>
      </div>
    </div>
  );
};

export default Community;
