import React from "react";
import { currencies } from "../constants/currencies";

export function Header({
  currency,
  setCurrency,
  totalMonthlySpend,
  totalPaidAllTime,
  onOpenSpendingModal,
}) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
      <h1 className="text-4xl font-bold flex items-center">
        <img src="/assets/TrackFlix.png" alt="logo" className="w-16 h-16" />
        TrackFlix
      </h1>
      <select
        value={currency.code}
        onChange={(e) =>
          setCurrency(
            currencies.find((c) => c.code === e.target.value) || currencies[0]
          )
        }
        className="bg-[#1d1d1d] text-[#d7d7d7] rounded-lg p-2 mr-4"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
      <div className="flex items-center">
        <div className="text-right">
          <button
            onClick={onOpenSpendingModal}
            className="text-lg font-semibold text-[#6c6c6c] hover:text-[#d7d7d7]"
          >
            Monthly spend: {currency.symbol}
            {totalMonthlySpend.toFixed(2)}
          </button>
          <div className="text-sm text-[#6c6c6c] mt-1">
            Total paid all time: {currency.symbol}
            {totalPaidAllTime.toFixed(2)}
          </div>
        </div>
      </div>
    </header>
  );
}
