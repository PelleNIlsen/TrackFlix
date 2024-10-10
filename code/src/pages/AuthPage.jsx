import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import React from "react";

export function AuthPage() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {user.firstName}!
          </h1>
          <p className="mb-4">You are signed in.</p>
          <button
            onClick={() => window.Clerk.signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Authentication</h1>
        <div className="mb-4">
          <SignIn />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Don't have an account?</h2>
          <SignUp />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
