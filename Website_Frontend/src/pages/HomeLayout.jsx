import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`transition-all p-4 ${
          isSidebarOpen
            ? "ml-64 w-[calc(100%-16rem)]"
            : "ml-16 w-[calc(100%-4rem)]"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};
