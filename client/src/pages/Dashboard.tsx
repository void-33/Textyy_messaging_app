import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatSidebar } from "@/components/chats-sidebar";
import { ChatInterface } from "@/components/chats-interface";
import { ChatSettings } from "@/components/chats-settings";

const Dashboard = () => {
  return (
    <div className="flex">
      <SidebarProvider className="w-fit">
        <AppSidebar />
      </SidebarProvider>

      <ChatSidebar />

      <SidebarProvider>
        <ChatInterface />
        <ChatSettings />
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
