import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

import useProtectedFetch from "@/hooks/useProtectedFetch";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatStore } from "@/stores/chatStore";
import UserSearch from "./user-search";
import { CirclePlus, Delete } from "lucide-react";

export function ChatSidebar() {
  const protectedFetch = useProtectedFetch();
  const { messages } = useChatStore();
  const navigate = useNavigate();
  const { username } = useParams();

  interface UserType {
    _id: string;
    username: string;
  }

  interface RoomCardType {
    _id: string;
    name: string;
    isGroup: boolean;
    groupId: string | null;
    otherUser: UserType;
    lastMessage: string;
    lastMessageAt: Date;
  }

  const [roomCards, setRoomCards] = useState<RoomCardType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchRoomCards = async () => {
      const response = await protectedFetch(
        "/api/roomcards/getroomcards",
        "GET"
      );
      const newCards = response?.data.roomCards || [];
      setRoomCards((prevRoomCards) => {
        //create map of new cards by username for quick access
        const newCardsMap = new Map(
          newCards.map((card: any) => [card.otherUser.username, card])
        );

        //replace temp cards with real ones only if username matches
        const updatedCards = prevRoomCards.map((card: any) => {
          if (
            newCardsMap.has(card.otherUser.username)
          ) {
            return newCardsMap.get(card.otherUser.username);
          }
          return card;
        });

        // 3. Add any new cards that didn't exist before
        const existingUsernames = new Set(
          updatedCards.map((card) => card.otherUser.username)
        );
        const additionalNewCards = newCards.filter(
          (card: any) => !existingUsernames.has(card.otherUser.username)
        );

        const combined = [...updatedCards, ...additionalNewCards];

        // Separate dummy and real cards
        const dummyCards = combined.filter(
          (card) => card.otherUser._id === "dummy_id"
        );
        const realCards = combined
          .filter((card) => card.otherUser._id !== "dummy_id")
          .sort(
            (a, b) =>
              new Date(b.lastMessageAt).getTime() -
              new Date(a.lastMessageAt).getTime()
          );

        return [...dummyCards, ...realCards];
      });
    };
    fetchRoomCards();
  }, [messages]);

  useEffect(() => {
    if (username) {
      const roomCardExists = roomCards.some(
        (card) => card.otherUser.username === username
      );
      if (!roomCardExists) {
        const newRoomCard: RoomCardType = {
          _id: `${username}-${Date.now()}`,
          name: username,
          isGroup: false,
          groupId: null,
          otherUser: { _id: "dummy_id", username },
          lastMessage: "",
          lastMessageAt: new Date(),
        };
        setRoomCards((prevRoomCards) => {
          const exists = prevRoomCards.some(
            (c) => c.otherUser.username === newRoomCard.otherUser.username
          );
          if (exists) return prevRoomCards;
          return [newRoomCard, ...prevRoomCards];
        });
      }
    }
  }, [username, roomCards]);

  const handleUserSelection = (otherUser: UserType) => {
    navigate(`/chats/${otherUser.username}`);
  };

  const newGroupCreation = () => {};

  const isSelectedCard = (cardUsername: string) => {
    return cardUsername === username;
  };

  return (
    <Card className="grow w-[30vw] my-2 flex flex-col">
      <CardHeader className="px-3 shrink-0">
        <CardTitle className="flex flex-row justify-between items-center">
          <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-2xl">
            Chats
          </h1>
          <CirclePlus
            className="hover:cursor-pointer"
            onClick={newGroupCreation}
          />
        </CardTitle>
        <div className="flex flex-row justify-between gap-2 items-center">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          ></Input>
          <Delete
            className="hover:cursor-pointer"
            onClick={() => setSearchQuery("")}
          />
        </div>
      </CardHeader>

      <CardContent className="grow px-2 flex flex-col overflow-hidden">
        {searchQuery.trim().length > 0 ? (
          <UserSearch searchQuery={searchQuery} />
        ) : (
          <div className="grow flex flex-col overflow-auto">
            <h4 className="shrink-0 scroll-m-20 text-sm font-normal tracking-tight lg:text-sm text-gray-500">
              All Chats
            </h4>
            <div className="grow overflow-scroll w-full scrollbar scrollbar-thumb-gray-400 scrollbar-thumb-rounded-xl scrollbar-w-1.5 dark:scrollbar-thumb-gray-700">
              {roomCards.map((item) => {
                return (
                  <Card
                    key={item._id}
                    className={clsx(
                      "m-2 hover:cursor-pointer",
                      isSelectedCard(item.otherUser.username) &&
                        "border border-primary"
                    )}
                    onClick={() => handleUserSelection(item.otherUser)}
                  >
                    <CardHeader>
                      <h6 className="text-xs tracking-tight lg:text-sm">
                        {item.otherUser.username}
                      </h6>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs">{item.lastMessage}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
