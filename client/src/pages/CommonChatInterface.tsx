import { ChatInterface } from "@/components/chats-interface";
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
            "--sidebar-width": "20vw",
          } as React.CSSProperties as React.CSSProperties & Record<string, any>
        }
      >
        <ChatInterface />
      </SidebarProvider>
    </>
  );
};

export default CommonChatInterface;
