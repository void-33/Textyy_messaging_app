import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./contexts/authContext";
import PrivateRoutes from "./components/PrivateRoutes";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import FriendRequest from "./pages/FriendRequest";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          <Route element={<Dashboard />}>
            <Route path="/chats" element={<Chat />} />

            {/* dynamic routing */}
            <Route path="/chats/:username" element={<Chat />} /> 
            
            <Route path="/friendrequest" element={<FriendRequest />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        //?temp route
      </Routes>
    </AuthProvider>
  );
};

export default App;
