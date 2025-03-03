import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Sidebar from "../components/Sidebar";

export const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex h-screen mt-12">
        <Sidebar />
        <div className="page-container ml-72 w-[80%] overflow-y-auto pt-8">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

