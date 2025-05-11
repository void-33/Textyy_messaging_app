import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import {
  AccordianItem,
  AccButton,
  AccContent,
  Button,
} from "./ui/custom-accordion";
import { CaseSensitiveIcon } from "lucide-react";

type UserType = {
  _id: string;
  username: string;
};

type PrivateRoomType = {
  _id: string;
  name: string;
  members: UserType[];
  isGroup: false;
  otherUser: UserType;
};
type GroupRoomType = {
  _id: string;
  name: string;
  members: UserType[];
  isGroup: true;
};

type RoomType = PrivateRoomType | GroupRoomType;

type ChatSettingsProps = {
  currRoom: RoomType | undefined;
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
            <AccButton className="w-full">Chats Info</AccButton>
            <AccContent></AccContent>
          </AccordianItem>

          <AccordianItem>
            <AccButton className="w-full">Group Settings</AccButton>
            <AccContent>
              <Button className="w-full">
                <CaseSensitiveIcon className="mr-4"/>Change Group Name
              </Button>
            </AccContent>
          </AccordianItem>

          <AccordianItem>
            <AccButton className="w-full">Media and Files</AccButton>
            <AccContent></AccContent>
          </AccordianItem>

          <AccordianItem>
            <AccButton className="w-full">Privacy and Security</AccButton>
            <AccContent></AccContent>
          </AccordianItem>
        </SidebarContent>
        <SidebarFooter>Footer here</SidebarFooter>
      </Sidebar>
    </>
  );
}
