import { SignOutButton, useUser } from "@clerk/clerk-react";
import React from "react";
import { SubscriptionStatus } from "../components/SubscriptionStatus";
import { SubscriptionButton } from "../components/SubscriptionButton";

export function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#d7d7d7] text-2xl">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#d7d7d7] text-2xl">
          Please sign in to view the dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#d7d7d7] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1d1d1d] rounded-2xl p-6 mb-8 flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <img
              src={user.imageUrl}
              alt={`${user.firstName}'s pfp`}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {user.firstName} {user.lastName}!
            </h1>
            <p className="text-[#6c6c6c]">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
        <div className="bg-[#1d1d1d] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
          <SubscriptionStatus />
          <SubscriptionButton priceId="price_1Q8owABsc6HJVesCZCqnF94g" />
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
