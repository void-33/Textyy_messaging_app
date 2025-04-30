import { Input } from "./ui/input";
import useProtectedFetch from "@/hooks/useProtectedFetch";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSelectedUser } from "@/contexts/selectedUserContext";

export function ChatSidebar() {
  const {setSelectedUserId} =useSelectedUser();
  const protectedFetch = useProtectedFetch();

  const [friends,setFriends] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await protectedFetch("/api/user/getfriends", "GET");
      setFriends(response?.data.friends);
    };
    fetchFriends();
  }, []);

  const handleChatClick=(otherUserId:string)=>{
    setSelectedUserId(otherUserId);
  }

  return (
    <Card className="grow w-[30vw] my-2 hover:cursor-pointer flex flex-col">
      <CardHeader className="px-3 shrink-0">
        <CardTitle>
          <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-2xl">
            Chats
          </h1>
        </CardTitle>
        <Input type="text" placeholder="Search"></Input>
      </CardHeader>
      <CardContent className="grow px-2 flex flex-col overflow-hidden">
        {/* <div className="shrink-0">
          <h4 className="scroll-m-20 text-sm font-normal tracking-tight lg:text-sm text-gray-500">
            Pinned
          </h4>
          <div className="max-h-64 overflow-auto w-full scrollbar scrollbar-thumb-gray-400 scrollbar-thumb-rounded-xl scrollbar-w-1.5 dark:scrollbar-thumb-gray-700">
            {arr.map((index) => ( (index<2) &&
              <Card key={index} className="my-2 mr-2 hover:cursor-pointer">
                <CardHeader>
                  <h6 className="text-xs font-semibold tracking-tight lg:text-sm">
                    {" "}
                    Name
                  </h6>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div> */}
        <div className="grow flex flex-col overflow-auto">
          <h4 className="shrink-0 scroll-m-20 text-sm font-normal tracking-tight lg:text-sm text-gray-500">
            All Chats
          </h4>
          <div className="grow overflow-scroll w-full scrollbar scrollbar-thumb-gray-400 scrollbar-thumb-rounded-xl scrollbar-w-1.5 dark:scrollbar-thumb-gray-700">
            {friends.map((item) => {
              return (
                <Card key={item._id} className="my-2 mr-2" onClick={()=>handleChatClick(item._id)}>
                  <CardHeader>
                    <h6 className="text-xs tracking-tight lg:text-sm hover:cursor-pointer">
                      {item.username}
                    </h6>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
