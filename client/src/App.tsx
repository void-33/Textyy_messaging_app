import { AuthProvider } from "./contexts/authContext";
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./routes/PrivateRoutes";
import Dashboard from "./pages/Dashboard";
import FriendRequestSidebar from "./components/friendRequest-sidebar";
import Settings from "./pages/Settings";
import CommonChatInterface from "./pages/CommonChatInterface";
import { ChatSidebar } from "./components/chats-sidebar";
import FriendsSidebar from "./components/friends-sidebar";
import AuthPage from "./pages/AuthPage";
import PublicRoute from "./routes/PublicRoutes";
import VerifyEmail from "./components/verifyEmail";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/*if authenticated- navigate to /chats otherwise render <AuthPage/> */}
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* only navigate to these routes if authenticated otherwise redirect to '/' */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Dashboard />}>
            <Route path="" element={<CommonChatInterface />}>
              <Route path="chats" element={<ChatSidebar />} />
              <Route path="chats/:roomId" element={<ChatSidebar />} />
              <Route path="friendrequest" element={<FriendRequestSidebar />} />
              <Route
                path="friendrequest/:roomId"
                element={<FriendRequestSidebar />}
              />
              <Route path="friends" element={<FriendsSidebar />} />
              <Route path="friends/:roomId" element={<FriendsSidebar />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
