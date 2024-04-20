'use client';
import exp from "constants";
import { Check, UserPlus, X } from "lucide-react";
import { FC, useState } from "react";

interface FriendRequestProps {
  incomingFriendRequests: incomingFriendRequest[];
  sessionId: string;

}

const FriendRequests: FC<FriendRequestProps> = ({ 
  incomingFriendRequests,
  sessionId,
}) => {
  const [friendRequests, setFriendRequests] = useState<incomingFriendRequest[]>(
    incomingFriendRequests
  );

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to Show Here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{request.senderEmail}</p>
            <button
              aria-label="accept friend"
              className="2-8 h-8 bg-indigo-600 hover:bg-indigo-700 gride place-itmes-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              aria-label="deny friend"
              className="2-8 h-8 bg-red-700 hover:bg-indigo-700 gride place-itmes-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>

          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;