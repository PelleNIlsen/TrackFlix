import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export function useSubscriber() {
  const { user } = useUser();
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await user.reload();
        setIsSubscriber(userData.unsafeMetadata.isSubscriber === true);
      } catch (error) {
        console.error("Error checking subscription status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [user]);

  const updateSubscriptionStatus = async (status) => {
    if (!user) return;

    try {
      await user.update({
        unsafeMetadata: { ...user.unsafeMetadata, isSubscriber: status },
      });
      setIsSubscriber(status);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };

  return { isSubscriber, isLoading, updateSubscriptionStatus };
}
