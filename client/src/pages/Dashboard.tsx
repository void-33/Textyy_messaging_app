import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatSidebar } from "@/components/chats-sidebar";
import { ChatInterface } from "@/components/chats-interface";
import { ChatSettings } from "@/components/chats-settings";
import { SelectedUserProvider } from "@/contexts/selectedUserContext";

const Dashboard = () => {
  return (
    <SelectedUserProvider>
      <div className="flex h-[100vh]">
        <SidebarProvider className="w-fit">
          <AppSidebar />
        </SidebarProvider>

        <ChatSidebar />

        <SidebarProvider>
          <ChatInterface />
          <ChatSettings />
        </SidebarProvider>
      </div>
    </SelectedUserProvider>
  );
};

export default Dashboard;
