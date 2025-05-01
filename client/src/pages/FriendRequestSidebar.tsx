import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useProtectedFetch from "@/hooks/useProtectedFetch";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FriendRequest = () => {
  interface ReceivedFriendRequestType {
    _id: string;
    createdAt: string;
    from: {
      _id: string;
      username: string;
    };
  }
  interface SentFriendRequestType {
    _id: string;
    createdAt: string;
    to: {
      _id: string;
      username: string;
    };
  }

  interface FriendType {
    _id: string;
    username: string;
  }

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sentFriendRequests, setSentFriendRequests] = useState<
    SentFriendRequestType[]
  >([]);
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<
    ReceivedFriendRequestType[]
  >([]);
  const [friends, setFriends] = useState<FriendType[]>([]);
  const [searchResults, setSearchResults] = useState<
    Array<Record<string, string>>
  >([]);
  const [sendingRequestTo, setSendingRequestTo] = useState<Array<string>>([]);
  const [acceptingRequest, setAcceptingRequest] = useState<Array<string>>([]);
  const [decliningRequest, setDecliningRequest] = useState<Array<string>>([]);
  const [cancelingRequest, setCancelingRequest] = useState<Array<string>>([]);

  const protectedFetch = useProtectedFetch();
  const navigate = useNavigate();

  const fetchFriendRequestsAndFriends = async () => {
    const friendReqRes = await protectedFetch(
      "/api/friendrequest/getpending",
      "GET"
    );
    const friendRes = await protectedFetch("/api/user/getfriends", "GET");
    if (friendReqRes?.data) {
      setSentFriendRequests(friendReqRes?.data.sentFriendRequests);
      setReceivedFriendRequests(friendReqRes?.data.receivedFriendRequests);
    }
    if (friendRes?.data) {
      setFriends(friendRes?.data.friends);
    }
  };

  useEffect(() => {
    fetchFriendRequestsAndFriends();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        const res = await protectedFetch(
          `/api/user/search?query=${searchQuery}`,
          "GET"
        );
        if (res?.data.users) {
          setSearchResults(res.data.users);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce input

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const sendFriendRequest = async (toUserId: string) => {
    setSendingRequestTo((prev) => [...prev, toUserId]);
    const res = await protectedFetch("/api/friendrequest/send", "POST", {
      toUserId,
    });
    if (res?.data.success) {
      alert("Friend request sent");
      await fetchFriendRequestsAndFriends();
    }
    setSendingRequestTo((prev) => prev.filter((id) => id !== toUserId));
  };

  const acceptFriendRequest = async (requestId: string) => {
    setAcceptingRequest((prev) => [...prev, requestId]);
    const res = await protectedFetch(
      `/api/friendrequest/accept/${requestId}`,
      "PATCH"
    );
    if (res?.data.success) {
      alert("Friend request accepted");
      await fetchFriendRequestsAndFriends();
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
      await fetchFriendRequestsAndFriends();
    }
    setDecliningRequest((prev) => prev.filter((id) => id !== requestId));
  };

  const cancelFriendRequest = async (requestId: string) => {
    setCancelingRequest((prev) => [...prev, requestId]);
    const res = await protectedFetch(
      `/api/friendrequest/cancel/${requestId}`,
      "DELETE"
    );
    if (res?.data.success) {
      alert("Friend request Canceled");
      await fetchFriendRequestsAndFriends();
    }
    setCancelingRequest((prev) => prev.filter((id) => id !== requestId));
  };

  const currentFriendIds = new Set(friends.map((user) => user._id));
  const receivedRequestMap = Object.fromEntries(
    receivedFriendRequests.map((req) => [req.from._id, req._id])
  );
  const sentRequestMap = Object.fromEntries(
    sentFriendRequests.map((req) => [req.to._id, req._id])
  );
  const friendResults = searchResults.filter((u) =>
    currentFriendIds.has(u._id)
  );
  const nonFriendsResults = searchResults.filter(
    (u) => !currentFriendIds.has(u._id)
  );

  const handleUserSelection = (username: string) => {
    navigate(`/chats/${username}`);
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
        {searchQuery.trim().length > 0 ? (
          <div className="grow overflow-auto">
            <h4 className="text-sm text-gray-500 mb-1">{`Search Results: ${searchQuery}`}</h4>
            {friendResults.length > 0 && (
              <h4 className="text-sm text-gray-500 mb-1">Friends</h4>
            )}
            {friendResults.map((user) => (
              <Card
                key={user._id}
                className="my-2 p-3 flex items-center justify-between"
                onClick={() => handleUserSelection(user.username)}
              >
                <span className="text-sm font-medium">{user.username}</span>
              </Card>
            ))}
            {nonFriendsResults.length > 0 && (
              <h4 className="text-sm text-gray-500 mb-1">All User</h4>
            )}
            {nonFriendsResults.map((user) => (
              <Card
                key={user._id}
                className="my-2 p-3 flex items-center justify-between"
              >
                <span className="text-sm font-medium">{user.username}</span>
                {receivedRequestMap[user._id] && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={acceptingRequest.includes(
                        receivedRequestMap[user._id]
                      )}
                      onClick={() =>
                        acceptFriendRequest(receivedRequestMap[user._id])
                      }
                    >
                      {acceptingRequest.includes(receivedRequestMap[user._id])
                        ? "Accepting..."
                        : "Accept"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={decliningRequest.includes(
                        receivedRequestMap[user._id]
                      )}
                      onClick={() =>
                        declineFriendRequest(receivedRequestMap[user._id])
                      }
                    >
                      {decliningRequest.includes(receivedRequestMap[user._id])
                        ? "Declining..."
                        : "Decline"}
                    </Button>
                  </>
                )}
                {sentRequestMap[user._id] && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={cancelingRequest.includes(
                      sentRequestMap[user._id]
                    )}
                    onClick={() =>
                      cancelFriendRequest(sentRequestMap[user._id])
                    }
                  >
                    {cancelingRequest.includes(sentRequestMap[user._id])
                      ? "Canceling..."
                      : "Cancel"}
                  </Button>
                )}
                {!receivedRequestMap[user._id] && !sentRequestMap[user._id] && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={sendingRequestTo.includes(user._id)}
                    onClick={() => sendFriendRequest(user._id)}
                  >
                    {sendingRequestTo.includes(user._id)
                      ? "Sending..."
                      : "AddFriend"}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        ) : (
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
