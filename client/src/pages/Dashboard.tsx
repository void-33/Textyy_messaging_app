import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { Outlet } from "react-router-dom";

const Dashboard = () => {
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
