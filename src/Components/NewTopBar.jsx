import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSettings, CiUser } from "react-icons/ci";
import Logo from "../assets/Switch.jpeg";
import Logout from "./Logout";

const TopBar = ({onSearch}) => {
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5085";

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(`${baseUrl}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log("Notifications: ", data);
      setNotifications(data);
    };

    fetchNotifications();
  }, []);


  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(search)
  }

  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-4 py-2 pb-3 sticky top-0 z-30">
      {/* Left: Brand Name */}
      <div className="flex items-center gap-2">
        <span className="lg:ml-2 ml-10 font-bold text-lg text-green-700 hidden sm:inline">CS-KMS</span>
      </div>
      {/* Center: Search */}
      <form className="w-2xs mx-auto"  onSubmit={handleSearch} >
        <div className="flex ml-9 items-center bg-gray-200 rounded-lg px-2 py-2 max-w-md">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none px-2 py-2 min-w-2 text-sm focus:outline-none"
            placeholder="Search for a post"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 px-3 py-2 rounded bg-green-500 text-white text-sm hover:bg-green-600 transition"
            >
            Search
          </button>
        </div>
      </form>
      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <button
          className="relative text-2xl text-green-700 hover:text-red-500 transition"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notifications"
        >
          <IoIosNotificationsOutline />
          {/* Notification dot */}
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
          )}
          
        </button>
        {/* Example notification dropdown */}
        {showNotifications && (
          <div className="absolute right-16 top-14 bg-white border rounded shadow-lg w-64 p-4 z-40">
            <div className="font-semibold mb-2 text-green-700">Notifications</div>
            {notifications.length === 0 ? (
               <div className="text-sm text-gray-600">No new notifications.</div>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
              {notifications.map((note) => (
                
                <li key={note.id} className="text-sm text-gray-700 border-b pb-2">
                  <p>{note.message}</p>
                  <p className="text-xs text-gray-400">{new Date(note.timestamp).toLocaleString()}</p>
                </li>
              ))}
              </ul>
            )
          }
           
          </div>
        )}
       <Logout
          className="text-2xl text-green-700 hover:text-red-500 transition"
          aria-label="Settings"
        />
        <button
          className="text-2xl text-green-700 hover:text-red-500 transition"
          aria-label="User"
        >
          <CiUser />
        </button>
      </div>
    </header>
  );
};

export default TopBar;