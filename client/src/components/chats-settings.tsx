import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import { AccordianItem, AccButton, AccContent } from "./ui/custom-accordion";
import GroupRenameButton from "./chat-settings/renameGroup";

import { RoomType } from "@/utils/types";

type ChatSettingsProps = {
  currRoom: RoomType | null;
};

export function ChatSettings({ currRoom }: ChatSettingsProps) {
  return (
    <>
      <Sidebar
        variant="floating"
        collapsible="offcanvas"
        side="right"
        className="mx-0"
      >
        <SidebarHeader>
          <h2 className="text-4xl text-center">{currRoom?.name}</h2>
        </SidebarHeader>
        <SidebarContent>
          <AccordianItem>
            <AccButton>Chats Info</AccButton>
            <AccContent></AccContent>
          </AccordianItem>

          <AccordianItem>
            <AccButton>Group Settings</AccButton>
            <AccContent>
              <GroupRenameButton currRoom={currRoom}/>
            </AccContent>
          </AccordianItem>

          <AccordianItem>
            <AccButton>Media and Files</AccButton>
            <AccContent></AccContent>
          </AccordianItem>

          <AccordianItem>
            <AccButton>Privacy and Security</AccButton>
            <AccContent></AccContent>
          </AccordianItem>
        </SidebarContent>
        <SidebarFooter>Footer here</SidebarFooter>
      </Sidebar>
    </>
  );
}
