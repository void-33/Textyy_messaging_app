import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";

export function ChatSettings() {
  return (
    <>
      <Sidebar variant='floating' collapsible='offcanvas' side="right" className="mx-0">
        <SidebarHeader>header here</SidebarHeader>
        <SidebarContent>content here</SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
    </>
  );
}
