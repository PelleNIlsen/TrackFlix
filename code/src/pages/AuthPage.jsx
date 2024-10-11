import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { LogIn, UserPlus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const [authMode, setAuthMode] = useState("signin");
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#d7d7d7] text-2xl">Loading...</div>
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0c0c0c] rounded-2xl overflow-hidden">
          <div className="flex justify-center items-center bg-[#1d1d1d] p-4 rounded-t-2xl">
            <button
              onClick={() => setAuthMode("signin")}
              className={`flex items-center px-4 py-2 rounded-lg ${
                authMode === "signin"
                  ? "bg-[#2d2d2d] text-[#d7d7d7]"
                  : "text-[#6c6c6c] hover:text-[#d7d7d7]"
              }`}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`flex items-center px-4 py-2 rounded-lg ml-4 ${
                authMode === "signup"
                  ? "bg-[#2d2d2d] text-[#d7d7d7]"
                  : "text-[#6c6c6c] hover:text-[#d7d7d7]"
              }`}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Sign Up
            </button>
          </div>
          <div className="p-6">
            {authMode === "signin" ? (
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-[#3d3d3d] hover:bg-[#4d4d4d] text-[#d7d7d7]",
                    formFieldInput:
                      "bg-[#1d1d1d] border-[#2d2d2d] text-[#d7d7d7]",
                    formFieldLabel: "text-[#d7d7d7]",
                    footerActionLink: "text-[#6c6c6c] hover:text-[#d7d7d7]",
                  },
                }}
              />
            ) : (
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-[#3d3d3d] hover:bg-[#4d4d4d] text-[#d7d7d7]",
                    formFieldInput:
                      "bg-[#1d1d1d] border-[#2d2d2d] text-[#d7d7d7]",
                    formFieldLabel: "text-[#d7d7d7]",
                    footerActionLink: "text-[#6c6c6c] hover:text-[#d7d7d7]",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
