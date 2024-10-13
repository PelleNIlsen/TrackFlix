import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";

export function useSubscriptions() {
  const { user, isSignedIn } = useUser();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    if (isSignedIn && user) {
      const userMetadata = user.unsafeMetadata;
      const storedSubscriptions = userMetadata.subscriptions || [];
      console.log(storedSubscriptions);
      setSubscriptions(storedSubscriptions);
    } else {
      const savedSubscriptions = localStorage.getItem("subscriptions");
      if (savedSubscriptions) {
        setSubscriptions(JSON.parse(savedSubscriptions));
      }
    }
    setIsLoading(false);
  }, [isSignedIn, user]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const saveSubscriptions = useCallback(
    async (subs) => {
      if (isSignedIn && user) {
        try {
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              subscriptions: subs.length > 0 ? subs : null,
            },
          });
          console.log("Subscriptions saved to user metadata");
        } catch (error) {
          console.error("Error saving subscriptions to user metadata:", error);
          if (error.errors) {
            console.error("Specific errors:", error.errors);
          }
        }
      } else {
        if (subs.length > 0) {
          localStorage.setItem("subscriptions", JSON.stringify(subs));
          console.log("Subscriptions saved to local storage");
        } else {
          localStorage.removeItem("subscriptions");
          console.log("Subscriptions removed from local storage");
        }
      }
      await loadSubscriptions(); // Reload subscriptions after saving
    },
    [isSignedIn, user, loadSubscriptions]
  );

  const addSubscription = useCallback(
    (newSubscription) => {
      setSubscriptions((prevSubscriptions) => {
        const updatedSubscriptions = [...prevSubscriptions, newSubscription];
        saveSubscriptions(updatedSubscriptions);
        return updatedSubscriptions;
      });
    },
    [saveSubscriptions]
  );

  const editSubscription = useCallback(
    (updatedSubscription) => {
      setSubscriptions((prevSubscriptions) => {
        const updatedSubscriptions = prevSubscriptions.map((sub) =>
          sub.id === updatedSubscription.id ? updatedSubscription : sub
        );
        saveSubscriptions(updatedSubscriptions);
        return updatedSubscriptions;
      });
    },
    [saveSubscriptions]
  );

  const deleteSubscription = useCallback(
    (subscriptionId) => {
      setSubscriptions((prevSubscriptions) => {
        const updatedSubscriptions = prevSubscriptions.filter(
          (sub) => sub.id !== subscriptionId
        );
        saveSubscriptions(updatedSubscriptions);
        return updatedSubscriptions;
      });
    },
    [saveSubscriptions]
  );

  return {
    subscriptions,
    addSubscription,
    editSubscription,
    deleteSubscription,
    isLoading,
    reloadSubscriptions: loadSubscriptions,
  };
}
