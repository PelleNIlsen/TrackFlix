import React from "react";
import { useUser } from "@clerk/clerk-react";

export function SubscriptionStatus() {
  const { user } = useUser();
  const isSubscribed = user?.publicMetadata?.isSubscribed;

  return (
    <div>
      {isSubscribed ? (
        <p>You are a subscriber!</p>
      ) : (
        <p>You are not subscribed yet.</p>
      )}
    </div>
  );
}
