import Admin from "./pages/Admin";
import MainPage from "./pages/MainPage";
import Sidebar from "./components/SideBar/Sidebar";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
