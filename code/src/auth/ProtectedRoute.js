import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import React from "react";

export function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default ProtectedRoute;
