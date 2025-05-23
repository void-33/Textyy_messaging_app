import { Button } from "./ui/button";
import { Card } from "@/components/ui/card";
import useProtectedFetch from "@/hooks/useProtectedFetch";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface UserSearchProps {
  searchQuery: string;
}

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
  roomId: string;
}

const UserSearch = ({ searchQuery }: UserSearchProps) => {
  const [sentFriendRequests, setSentFriendRequests] = useState<
    SentFriendRequestType[]
  >([]);
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<
    ReceivedFriendRequestType[]
  >([]);
  const [friends, setFriends] = useState<FriendType[]>([]);
  const [searchResults, setSearchResults] = useState<FriendType[]>([]);
  const [sendingRequestTo, setSendingRequestTo] = useState<Array<string>>([]);
  const [acceptingRequest, setAcceptingRequest] = useState<Array<string>>([]);
  const [decliningRequest, setDecliningRequest] = useState<Array<string>>([]);
  const [cancelingRequest, setCancelingRequest] = useState<Array<string>>([]);

  const protectedFetch = useProtectedFetch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchFriendRequestsAndFriends = useCallback(async () => {
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
      setFriends(friendRes?.data.friendsWithRoom);
    }
  },[protectedFetch])

  useEffect(() => {
    fetchFriendRequestsAndFriends();
  }, [fetchFriendRequestsAndFriends]);

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
  }, [searchQuery,protectedFetch]);

  const sendFriendRequest = async (toUserId: string) => {
    setSendingRequestTo((prev) => [...prev, toUserId]);
    const res = await protectedFetch("/api/friendrequest/send", "POST", {
      toUserId,
    });
    if (res?.data.success) {
      const toastId = toast("Friend Request Sent", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(toastId),
        },
      });
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
      const toastId = toast("Friend Request Accepted", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(toastId),
        },
      });
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
      const toastId = toast("Friend Request Declined", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(toastId),
        },
      });
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
      const toastId = toast("Friend Request Canceled", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(toastId),
        },
      });
      await fetchFriendRequestsAndFriends();
    }
    setCancelingRequest((prev) => prev.filter((id) => id !== requestId));
  };

  const currentFriendIds = new Set(friends.map((user) => user._id));
  const receivedRequestMap = Object.fromEntries(
    receivedFriendRequests.map((req) => [req.from._id, req._id])
  );
  const sentRequestMap = Object.fromEntries(
    sentFriendRequests.map((req) => [req?.to._id, req._id])
  );
  const friendMap = Object.fromEntries(friends.map((f) => [f._id, f.roomId]));
  const friendResults = searchResults
    .filter((u) => currentFriendIds.has(u._id))
    .map((u) => ({
      ...u,
      roomId: friendMap[u._id] || "", // fallback if not found
    }));
  const nonFriendsResults = searchResults.filter(
    (u) => !currentFriendIds.has(u._id)
  );

  const handleUserSelection = (roomId: string) => {
    const path = location.pathname;
    const basePath = path.startsWith("/friendrequest")
      ? "/friendrequest"
      : path.startsWith("/friends")
      ? "/friends"
      : "/chats";
    navigate(`${basePath}/${roomId}`);
  };

  return (
    <div className="grow overflow-auto">
      <h4 className="text-sm text-gray-500 mb-1">{`Search Results: ${searchQuery}`}</h4>
      {friendResults.length > 0 && (
        <h4 className="text-sm text-gray-500 mb-1">Friends</h4>
      )}
      {friendResults.map((user) => (
        <Card
          key={user._id}
          className="my-2 p-3 flex items-center justify-between hover:cursor-pointer"
          onClick={() => handleUserSelection(user.roomId)}
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
          className="my-2 p-3 flex items-center justify-between hover:cursor-pointer"
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
              disabled={cancelingRequest.includes(sentRequestMap[user._id])}
              onClick={() => cancelFriendRequest(sentRequestMap[user._id])}
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
              {sendingRequestTo.includes(user._id) ? "Sending..." : "AddFriend"}
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default UserSearch;
