import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTask from "./pages/CreateTask";
import Profile from "./pages/profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} exact={true} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateTask />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
