import { ChatInterface } from "@/components/chats-interface";
import { ChatSettings } from "@/components/chats-settings";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const ChatandFriendRequest = () => {
  return (
    <>
      <Outlet />

      <SidebarProvider defaultOpen={false}>
        <ChatInterface />
        <ChatSettings />
      </SidebarProvider>
    </>
  );
};

export default ChatandFriendRequest;