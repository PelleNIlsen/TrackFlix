import { useState, useEffect } from "react";
import { currencies } from "../constants/currencies";

export function useCurrency() {
  const [currency, setCurrency] = useState(currencies[0]);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(JSON.parse(savedCurrency));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currency", JSON.stringify(currency));
  }, [currency]);

  return { currency, setCurrency };
}
