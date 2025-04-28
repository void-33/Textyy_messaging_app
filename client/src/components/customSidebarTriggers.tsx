import { useSidebar } from "@/components/ui/sidebar";
import { ArrowLeftFromLineIcon, ExpandIcon, EllipsisIcon } from "lucide-react";

export function ChatsInfoButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <EllipsisIcon onClick={toggleSidebar} className="hover:cursor-pointer" />
  );
}

export function AppSidebarMinimizeButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className=" hover:cursor-pointer ml-auto hover:border-1 hover:border-gray-400 rounded-lg p-1">
      <ArrowLeftFromLineIcon onClick={toggleSidebar} size={23} />
    </div>
  );
}

export function AppSidebarMaximizeButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="mt-2 hover:cursor-pointer border-1 border-transparent rounded-lg p-1 hover:border-gray-400">
      <ExpandIcon onClick={toggleSidebar} size={20} />
    </div>
  );
}
