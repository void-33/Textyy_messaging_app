import React, { useEffect, useState } from "react";
import { ScrollArea } from "./scroll-area";
import useProtectedFetch from "@/hooks/useProtectedFetch";
import { Separator } from "./separator";
import { X } from "lucide-react";

interface UserType {
  _id: string;
  username: string;
}

interface FriendsScrollAreaProps{
  queuedToAdd: UserType[];
  setQueuedToAdd: React.Dispatch<React.SetStateAction<UserType[]>>;
}

const FriendsScrollArea = ({queuedToAdd,setQueuedToAdd}: FriendsScrollAreaProps) => {
  const [friends, setfriends] = useState<UserType[]>([]);

  const protectedFetch = useProtectedFetch();
  
  useEffect(() => {
    const fetchFriends = async () => {
      const response = await protectedFetch("/api/user/getFriends", "GET");
      if (response?.data.success) {
        setfriends(response.data.friends);
      }
    };
    fetchFriends();
  }, []);

  const AddToQueue = (u: UserType) => {
    setQueuedToAdd((prev) => {
      if (prev.some((p) => p._id === u._id)) return prev;
      return [...prev, u];
    });
  };

  return (
    <>
      <div className="flex flex-row gap-1 flex-wrap">
        {queuedToAdd.map((q) => (
          <div className="flex flex-row justify-between w-fit items-center border-2 border-secondary rounded-xl p-1 text-sm">
            {q.username}
            <X
              onClick={() =>
                setQueuedToAdd((prev) => prev.filter((p) => p._id !== q._id))
              }
              className="text-primary"
            ></X>
          </div>
        ))}
      </div>
      <ScrollArea className="h-50 w-full rounded-xl border">
        {friends.map((u) => {
          return (
            <div key={u._id}>
              <button
                className="text-base hover:bg-secondary w-full rounded-xl h-12 hover:cursor-pointer"
                key={u._id}
                onClick={()=>AddToQueue(u)}
              >
                {u.username}
              </button>
              <Separator />
            </div>
          );
        })}
      </ScrollArea>
    </>
  );
};

export default FriendsScrollArea;
