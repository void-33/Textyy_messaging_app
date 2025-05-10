import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useState } from "react";
import RenameGroup from "./chat-settings/renameGroup";


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
  currRoom: RoomType|undefined;
}

export function ChatSettings({currRoom}:ChatSettingsProps) {

  const [isGroup, setIsGroup] = useState<boolean>(true);

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
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="hover:cursor-pointer">
              <AccordionTrigger>Chat Info</AccordionTrigger>
              <AccordionContent>Content here</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Customize Chat</AccordionTrigger>
              <AccordionContent>content here</AccordionContent>
            </AccordionItem>
            {isGroup && (
              <AccordionItem value="item-6">
                <AccordionTrigger>Group Setting</AccordionTrigger>
                <AccordionContent className="flex flex-col">
                  <RenameGroup />
                  {/* <AddGroupMembers /> */}
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="item-3">
              <AccordionTrigger>Media and Files</AccordionTrigger>
              <AccordionContent>Content here</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Privacy and Securtiy</AccordionTrigger>
              <AccordionContent>Content here</AccordionContent>
            </AccordionItem>
          </Accordion>
        </SidebarContent>
        <SidebarFooter>Footer here</SidebarFooter>
      </Sidebar>
    </>
  );
}
