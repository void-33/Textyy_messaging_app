import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import useSocketStore from "@/stores/socketStore";
import { useChatStore } from "@/stores/chatStore";

interface Message {
  _id: string;
  sender: string;
  roomId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

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

    socket.on("message", (roomId:string,message: Message) => {
      addMessage(roomId,message);
    });

    return () => {
      socket.off('message');
      disconnectSocket();
    };
  }, [addMessage,disconnectSocket,getSocket,initSocket]);

  return (
    <div className="flex h-[100vh]">
      <SidebarProvider
        defaultOpen={false}
        className="w-fit"
        style={
          {
            "--sidebar-width": "20vw",
          } as React.CSSProperties & { [key: string]: string }
        }
      >
        <AppSidebar />
      </SidebarProvider>

      <Outlet />
    </div>
  );
};

export default Dashboard;
