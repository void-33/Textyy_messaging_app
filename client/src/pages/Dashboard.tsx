import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getSocket, initSocket, disconnectSocket } from "@/contexts/socket";
import { useChatStore } from "@/store/chatStore";

const Dashboard = () => {
  const {addMessage} = useChatStore((state)=>state);

  useEffect(()=>{
    initSocket();
    const socket = getSocket();

    socket.on("connect", () => {
      socket.emit("register");  //? off?
    });

    socket.on("privateMessage", (message:any) => {
      addMessage(message);
    });

    return () => {
      disconnectSocket();
    };
  },[])

  return (
    <div className="flex h-[100vh]">
      <SidebarProvider defaultOpen={false} className="w-fit">
        <AppSidebar />
      </SidebarProvider>

      <Outlet />
    </div>
  );
};

export default Dashboard;
