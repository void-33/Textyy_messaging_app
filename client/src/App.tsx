import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./contexts/authContext";
import PrivateRoutes from "./components/PrivateRoutes";
import Dashboard from "./pages/Dashboard";
import FriendRequestSidebar from "./components/friendRequest-sidebar";
import Settings from "./pages/Settings";
import CommonChatInterface from "./pages/CommonChatInterface";
import { ChatSidebar } from "./components/chats-sidebar";
import FriendsSidebar from "./components/friends-sidebar";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          <Route path="/" element={<Dashboard />}>
            <Route path="" element={<CommonChatInterface />}>
              <Route path="chats" element={<ChatSidebar />} />
              <Route path="chats/:username" element={<ChatSidebar />} />
              <Route path="friendrequest" element={<FriendRequestSidebar />} />
              <Route path="friendrequest/:username" element={<FriendRequestSidebar />} />
              <Route path="friends" element={<FriendsSidebar />} />
              <Route path="friends/:username" element={<FriendsSidebar />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        //?temp route
      </Routes>
    </AuthProvider>
  );
};

export default App;
