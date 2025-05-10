import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import useSocketStore from "@/stores/socketStore";
import { useChatStore } from "@/stores/chatStore";

const Dashboard = () => {
  const { addMessage } = useChatStore((state) => state);

  const getSocket = useSocketStore((state) => state.getSocket);
  const initSocket = useSocketStore((state) => state.initSocket);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);

  useEffect(() => {
    initSocket();
    const socket = getSocket();

    socket.on("connect", () => {
      socket.emit("register"); //? off?
    });

    socket.on("message", (roomId:string,message: any) => {
      addMessage(roomId,message);
    });

    return () => {
      socket.off('message');
      disconnectSocket();
    };
  }, []);

  return (
    <div className="flex h-[100vh]">
      <SidebarProvider
        defaultOpen={false}
        className="w-fit"
        style={
          {
            "--sidebar-width": "10vw",
          } as React.CSSProperties as React.CSSProperties & Record<string, any>
        }
      >
        <AppSidebar />
      </SidebarProvider>

      <Outlet />
    </div>
  );
};

export default Dashboard;
