import { useState } from "react";
import { motion } from "framer-motion";
import { useProjectContext } from "../context/ProjectContext";

// const onlineUsers = [
//   { id: 1, name: "Ashish", initials: "A", color: "bg-pink-600" },
//   { id: 2, name: "Aman", initials: "A", color: "bg-gray-700" },
//   { id: 3, name: "Vikram", initials: "V", color: "bg-orange-700" },
// ];

export default function OnlineUsers() {
  const [showPopup, setShowPopup] = useState(false);
  const {onlineUsers} = useProjectContext();
  // console.log("onlineUsers in online users",onlineUsers);


  return (
    <div className="relative z-10">
      {/* User Avatars */}
      <div className="flex -space-x-2 cursor-pointer" onClick={() => setShowPopup(!showPopup)}>
        {onlineUsers.slice(0, 3).map((user, index) => (
          <div
            key={index}
            className={`w-10 h-10 ${user.color} text-white font-bold bg-amber-500 flex items-center justify-center rounded-full border-2 border-gray-900 z-20`}
            style={{ zIndex: onlineUsers.length - index }}
          >
            <p className="text-white">{user.name}</p>
            
          </div>
        ))}
      </div>

      {/* Popup User List */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-12 left-0 w-48 bg-gray-800 text-white p-3 rounded shadow-lg"
        >
          <h3 className="text-lg font-bold mb-2">Online Users</h3>
          <ul>
            {onlineUsers.map((user) => (
              <li key={user._id} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                <div className={`w-8 h-8 ${user.color} text-white font-bold flex items-center justify-center rounded-full`}>
                  {user.initials}
                </div>
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
