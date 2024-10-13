import { useUser } from "@clerk/clerk-react";
import { useSubscriber } from "../hooks/useSubscriber";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function VerificationComponent() {
  const [verificationStatus, setVerificationStatus] = useState("Verifying...");
  const { updateSubscriptionStatus } = useSubscriber();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        setVerificationStatus("No session ID provided");
        return;
      }

      try {
        const response = await fetch(
          `https://trackflix.pellenilsen.no/api/verify-session?session_id=${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setVerificationStatus(
            `Payment successful. Amount: ${
              data.data.amount / 100
            } ${data.data.currency.toUpperCase()}`
          );

          // Update Clerk metadata
          if (user) {
            await updateSubscriptionStatus(true);
            console.log("User subscription status updated in Clerk");
            navigate("/");
          }
        } else {
          setVerificationStatus(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        setVerificationStatus("Error verifying session");
      }
    };

    verifySession();
  }, [user, updateSubscriptionStatus]);

  return <p>{verificationStatus}</p>;
}
