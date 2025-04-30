import { ChatSidebar } from "@/components/chats-sidebar";
import { ChatInterface } from "@/components/chats-interface";
import { ChatSettings } from "@/components/chats-settings";
import { SidebarProvider } from "@/components/ui/sidebar";

const Chat = () => {
  return (
    <>
      <ChatSidebar />

      <SidebarProvider defaultOpen={false}>
        <ChatInterface />
        <ChatSettings />
      </SidebarProvider>
    </>
  );
};

export default Chat;
