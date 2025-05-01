import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useProtectedFetch from "@/hooks/useProtectedFetch";

import { useEffect, useState } from "react";

import UserSearch from "@/components/user-search";

const FriendRequest = () => {
  interface ReceivedFriendRequestType {
    _id: string;
    createdAt: string;
    from: {
      _id: string;
      username: string;
    };
  }

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<
    ReceivedFriendRequestType[]
  >([]);
  const [acceptingRequest, setAcceptingRequest] = useState<Array<string>>([]);
  const [decliningRequest, setDecliningRequest] = useState<Array<string>>([]);

  const protectedFetch = useProtectedFetch();

  const fetchFriendReq =async ()=>{
    const friendReqRes = await protectedFetch(
      "/api/friendrequest/getpending",
      "GET"
    );
    if (friendReqRes?.data) {
      setReceivedFriendRequests(friendReqRes?.data.receivedFriendRequests);
    }
  };

  useEffect(() => {
    fetchFriendReq();
  }, []);

  const acceptFriendRequest = async (requestId: string) => {
    setAcceptingRequest((prev) => [...prev, requestId]);
    const res = await protectedFetch(
      `/api/friendrequest/accept/${requestId}`,
      "PATCH"
    );
    if (res?.data.success) {
      alert("Friend request accepted");
      await fetchFriendReq();
    }
    setAcceptingRequest((prev) => prev.filter((id) => id !== requestId));
  };

  const declineFriendRequest = async (requestId: string) => {
    setDecliningRequest((prev) => [...prev, requestId]);
    const res = await protectedFetch(
      `/api/friendrequest/decline/${requestId}`,
      "DELETE"
    );
    if (res?.data.success) {
      alert("Friend request declined");
      await fetchFriendReq();
    }
    setDecliningRequest((prev) => prev.filter((id) => id !== requestId));
  };

  return (
    <Card className="grow w-[30vw] my-2 hover:cursor-pointer flex flex-col">
      <CardHeader className="px-3 shrink-0">
        <CardTitle>
          <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-2xl">
            Friends Requests
          </h1>
        </CardTitle>
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></Input>
      </CardHeader>

      <CardContent className="grow px-2 flex flex-col overflow-hidden">
        {searchQuery.trim().length > 0 ? <UserSearch searchQuery={searchQuery} /> : (
          <div className="grow flex flex-col overflow-auto">
            <h4 className="shrink-0 scroll-m-20 text-sm font-normal tracking-tight lg:text-sm text-gray-500">
              All Recieved Requests
            </h4>
            <div className="grow overflow-scroll w-full scrollbar scrollbar-thumb-gray-400 scrollbar-thumb-rounded-xl scrollbar-w-1.5 dark:scrollbar-thumb-gray-700">
              {receivedFriendRequests.length === 0 && (
                <p className="text-sm text-muted-foreground px-3 mt-2">
                  No incoming friend requests.
                </p>
              )}
              {receivedFriendRequests.map((req) => {
                return (
                  <Card key={req._id} className="my-2 mr-2">
                    <CardHeader>
                      <h6 className="text-xs tracking-tight lg:text-sm hover:cursor-pointer">
                        {req.from.username}
                      </h6>
                    </CardHeader>
                    <CardContent>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={acceptingRequest.includes(req._id)}
                        onClick={() => acceptFriendRequest(req._id)}
                      >
                        {acceptingRequest.includes(req._id)
                          ? "Accepting..."
                          : "Accept"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={decliningRequest.includes(req._id)}
                        onClick={() => declineFriendRequest(req._id)}
                      >
                        {decliningRequest.includes(req._id)
                          ? "Declining..."
                          : "Decline"}
                      </Button>
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
};

export default FriendRequest;
