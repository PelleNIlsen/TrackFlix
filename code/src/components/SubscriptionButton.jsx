import React from "react";
import { useUser } from "@clerk/clerk-react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Q3zRsBsc6HJVesCMXSyTJdibb9S9JLIokFvp8B4jzfCH9tWJf1CGO9ReJG9hI8gXNeVBbmc7Cw1WLCpvc7bPrQ600IKgVKD7A"
);

export function SubscriptionButton({ priceId }) {
  const { user } = useUser();

  const handleSubscribe = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const stripe = await stripePromise;
      const token = await user.id;

      const response = await fetch(
        `https://trackflix.pellenilsen.no/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            priceId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Subscribe Now
    </button>
  );
}
