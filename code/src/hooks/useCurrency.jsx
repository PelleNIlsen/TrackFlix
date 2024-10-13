import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";

export function useCurrency() {
  const { user, isSignedIn } = useUser();
  const [currency, setCurrencyState] = useState({ code: "USD", symbol: "$" });

  const loadCurrency = useCallback(async () => {
    if (isSignedIn && user) {
      const userMetadata = user.unsafeMetadata;
      const storedCurrency = userMetadata.currency || {
        code: "USD",
        symbol: "$",
      };
      console.log(storedCurrency);
      setCurrencyState(storedCurrency);
    } else {
      const savedCurrency = localStorage.getItem("currency");
      if (savedCurrency) {
        setCurrencyState(JSON.parse(savedCurrency));
      }
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    loadCurrency();
  }, [loadCurrency]);

  const saveCurrency = useCallback(
    async (newCurrency) => {
      if (isSignedIn && user) {
        try {
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              currency: newCurrency,
            },
          });
          console.log("Currency saved to user metadata");
        } catch (error) {
          console.error("Error saving currency to user metadata:", error);
          if (error.errors) {
            console.error("Specific errors:", error.errors);
          }
        }
      } else {
        localStorage.setItem("currency", JSON.stringify(newCurrency));
        console.log("Currency saved to local storage");
      }
      setCurrencyState(newCurrency);
    },
    [isSignedIn, user]
  );

  const setCurrency = useCallback(
    (newCurrency) => {
      saveCurrency(newCurrency);
    },
    [saveCurrency]
  );

  return { currency, setCurrency };
}
