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
          } as React.CSSProperties & { [key: string]: string }
        }
      >
        <ChatInterface />
      </SidebarProvider>
    </>
  );
};

export default CommonChatInterface;
