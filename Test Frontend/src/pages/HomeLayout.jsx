import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Sidebar from "../components/Sidebar";

export const HomeLayout = () => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex h-screen">
        <Sidebar />
        <div className="page-container ml-72 w-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

