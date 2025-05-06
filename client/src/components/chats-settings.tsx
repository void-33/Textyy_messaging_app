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

import { useParams } from "react-router-dom";
import { useState } from "react";
import AddGroupMembers from "./chat-settings/addGroupMembers";
import RenameGroup from "./chat-settings/renameGroup";

export function ChatSettings() {
  const { username } = useParams();

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
          <h2 className="text-4xl text-center">{username}</h2>
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
                  <AddGroupMembers />
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
