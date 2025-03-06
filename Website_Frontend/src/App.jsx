import { Routes, Route } from "react-router";
import { HomeLayout } from "./pages/HomeLayout";
import { Landing } from "./pages/Landing";
import { ContactUs } from "./pages/ContactUs";
import { AboutUs } from "./pages/AboutUs";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./context/AuthContext";

import { ScriptContextProvider } from "./context/ScriptContext";
import Dashboard from "./pages/Dashboard";
import EditorPage from "./pages/EditorPage";
import ProjectsPage from "./pages/ProjectsPage";
import { SocketContextProvider } from "./context/SocketContext";
import { ProjectContextProvider } from "./context/ProjectContext";
import Setting from "./pages/Setting";

function App() {
  return (
    <>
      <AuthContextProvider>
        <SocketContextProvider>
          <ProjectContextProvider>
            <ScriptContextProvider>
              <Routes>
                <Route path="/" element={<HomeLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:projectId" element={<EditorPage />} />
                  <Route
                    path="/projects/:projectId/documents/:docId"
                    element={<EditorPage />}
                  />
                  <Route path="/setting" element={<Setting />} />
                </Route>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              </Routes>

              <Toaster />
            </ScriptContextProvider>
          </ProjectContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </>
  );
}
export default App;
