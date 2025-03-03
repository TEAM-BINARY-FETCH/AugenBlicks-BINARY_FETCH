import { useState, useEffect } from "react";
import { FiMic, FiUsers, FiEye, FiHeart, FiClock, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";
import { useAuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const Dashboard = () => {
  const { authUser, authToken } = useAuthContext();
  const [podcasts, setPodcasts] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const { t } = useTranslation(); // Initialize useTranslation

  // Dummy Data for Charts
  const [monthlyPodcasts, setMonthlyPodcasts] = useState([
    { month: "Jan", value: 120 },
    { month: "Feb", value: 180 },
    { month: "Mar", value: 220 },
    { month: "Apr", value: 150 },
    { month: "May", value: 240 },
    { month: "Jun", value: 320 },
  ]);

  const [voiceUsage, setVoiceUsage] = useState([
    { name: "Male AI", value: 40 },
    { name: "Female AI", value: 60 },
  ]);

  const [viewsGrowth, setViewsGrowth] = useState([
    { month: "Jan", views: 0 },
    { month: "Feb", views: 2 },
    { month: "Mar", views: 10 },
    { month: "Apr", views: 17 },
    { month: "May", views: 59 },
    { month: "Jun", views: 120 },
  ]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/podcast`, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      console.log("Data", data);
      setPodcasts(data);

      const views = data?.podcasts?.reduce((prev_podcast, next_podcast) => {
        return prev_podcast + next_podcast.views;
      }, 0);
      setTotalViews(views);

      const likes = data?.podcasts?.reduce((prev_podcast, next_podcast) => {
        return prev_podcast + next_podcast.likes;
      }, 0);
      setTotalLikes(likes);
    };
    // fetchPodcasts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Dashboard Header */}
      <h2 className="text-2xl font-bold mb-6">{t("dashboard.title")}</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={FiMic} title={t("dashboard.totalPodcasts")} value={podcasts?.count?.toString().padStart(2, "0")} trend="Growing" color="bg-blue-100 text-blue-600" />
        <MetricCard icon={FiUsers} title={t("dashboard.totalUsers")} value="109" trend="Active" color="bg-green-100 text-green-600" />
        <MetricCard icon={FiEye} title={t("dashboard.totalViews")} value={totalViews} trend="High Engagement" color="bg-purple-100 text-purple-600" />
        <MetricCard icon={FiHeart} title={t("dashboard.totalLikes")} value={totalLikes} trend="Popular" color="bg-red-100 text-red-600" />
        <MetricCard icon={FiClock} title={t("dashboard.avgDuration")} value="18 mins" trend="Standard" color="bg-yellow-100 text-yellow-600" />
        <MetricCard icon={FiTrendingUp} title={t("dashboard.topPodcast")} value={`${podcasts?.podcasts?.[0]?.title} 🎧`} trend="Trending" color="bg-indigo-100 text-indigo-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart - Monthly Podcasts Created */}
        <ChartContainer title={t("dashboard.monthlyPodcasts")}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyPodcasts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Pie Chart - AI Voice Usage */}
        <ChartContainer title={t("dashboard.voiceUsage")}>
          <PieChart width={400} height={300}>
            <Pie data={voiceUsage} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              <Cell fill="#3B82F6" />
              <Cell fill="#F59E0B" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartContainer>

        {/* Line Chart - Views Growth */}
        <ChartContainer title={t("dashboard.viewsGrowth")}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, title, value, trend, color }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <span className={`text-sm px-2 py-1 rounded-full ${color}`}>{trend}</span>
      </div>
      <Icon className="w-12 h-12 text-gray-400" />
    </div>
  </motion.div>
);

// Chart Container
const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default Dashboard;