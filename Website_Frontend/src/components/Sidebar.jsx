import { Link, useLocation } from "react-router-dom";
import { Home, AddCircleOutline, Headphones, VideoChat } from "@mui/icons-material";
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ExploreIcon from '@mui/icons-material/Explore';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import { motion } from "framer-motion";
import { FaMicrophoneAlt } from "react-icons/fa";
import { RiFolderHistoryLine } from "react-icons/ri";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const sidebarVariants = {
  hidden: { x: -250, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function Sidebar() {
  const location = useLocation(); // Get current route path
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <motion.div
      className="h-screen w-64 bg-white text-black fixed top-20 left-0 shadow-xl p-4"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <ul className="space-y-2">
        {/* Home */}
        <li>
          <Link
            to="/"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <Home className={`${location.pathname === "/" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.dashboard")}</span>
          </Link>
        </li>

        {/* Create Content */}
        <li>
          <Link
            to="/generate-content"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/generate-content" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <AddCircleOutline className={`${location.pathname === "/generate-content" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.createContent")}</span>
          </Link>
        </li>

        {/* Generate Audio */}
        <li>
          <Link
            to="/generate-audio"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/generate-audio" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <Headphones className={`${location.pathname === "/generate-audio" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.generateAudio")}</span>
          </Link>
        </li>

        {/* Upload Podcast */}
        <li>
          <Link
            to="/upload-podcast"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/upload-podcast" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <FaMicrophoneAlt className={`${location.pathname === "/upload-podcast" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.uploadPodcast")}</span>
          </Link>
        </li>

        {/* Your Podcasts */}
        <li>
          <Link
            to="/your-podcasts"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/your-podcasts" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <RiFolderHistoryLine className={`${location.pathname === "/your-podcasts" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.yourPodcasts")}</span>
          </Link>
        </li>

        {/* Podcaster Hub */}
        <li>
          <Link
            to="/podcaster-hub"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/podcaster-hub" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <ExploreIcon className={`${location.pathname === "/podcaster-hub" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.podcasterHub")}</span>
          </Link>
        </li>

        {/* Webinars */}
        <li>
          <Link
            to="/webinars"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/webinars" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <CampaignIcon className={`${location.pathname === "/webinars" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.webinars")}</span>
          </Link>
        </li>

        {/* Video Tutorials */}
        <li>
          <Link
            to="/tutorials"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/tutorials" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <VideoLibraryIcon className={`${location.pathname === "/tutorials" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.tutorials")}</span>
          </Link>
        </li>

        {/* Community */}
        <li>
          <Link
            to="/community"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/community" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <PeopleIcon className={`${location.pathname === "/community" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.community")}</span>
          </Link>
        </li>

        {/* Profile */}
        <li>
          <Link
            to="/profile"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/profile" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <AccountCircleIcon className={`${location.pathname === "/profile" ? "text-orange-500" : ""}`} />
            <span>{t("sidebar.profile")}</span>
          </Link>
        </li>
      </ul>
    </motion.div>
  );
}