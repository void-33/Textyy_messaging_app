import { ChatInterface } from "@/components/chats-interface";
import { ChatSettings } from "@/components/chats-settings";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const CommonChatInterface = () => {
  return (
    <>
      <Outlet />

      <SidebarProvider
        defaultOpen={false}
        style={
          {
            "--sidebar-width": "22rem",
          } as React.CSSProperties as React.CSSProperties & Record<string, any>
        }
      >
        <ChatInterface />
        <ChatSettings />
      </SidebarProvider>
    </>
  );
};

export default CommonChatInterface;
