import { useState } from "react";
import { motion } from "framer-motion";

const users = [
  { id: 1, name: "Ashish", initials: "A", color: "bg-pink-600" },
  { id: 2, name: "Aman", initials: "A", color: "bg-gray-700" },
  { id: 3, name: "Vikram", initials: "V", color: "bg-orange-700" },
];

export default function OnlineUsers() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="relative">
      {/* User Avatars */}
      <div className="flex -space-x-2 cursor-pointer" onClick={() => setShowPopup(!showPopup)}>
        {users.slice(0, 3).map((user, index) => (
          <div
            key={user.id}
            className={`w-10 h-10 ${user.color} text-white font-bold flex items-center justify-center rounded-full border-2 border-gray-900`}
            style={{ zIndex: users.length - index }}
          >
            {user.initials}
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
            {users.map((user) => (
              <li key={user.id} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
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
