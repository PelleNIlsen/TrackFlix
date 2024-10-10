import { useState, useEffect } from "react";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const savedSubscriptions = localStorage.getItem("subscriptions");
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }
  }, []);

  useEffect(() => {
    if (subscriptions.length > 0) {
      localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    } else {
      localStorage.removeItem("subscriptions");
    }
  }, [subscriptions]);

  const addSubscription = (newSubscription) => {
    setSubscriptions((prevSubscriptions) => [
      ...prevSubscriptions,
      newSubscription,
    ]);
  };

  const editSubscription = (updatedSubscription) => {
    setSubscriptions((prevSubscriptions) =>
      prevSubscriptions.map((sub) =>
        sub.id === updatedSubscription.id ? updatedSubscription : sub
      )
    );
  };

  return { subscriptions, addSubscription, editSubscription };
}
