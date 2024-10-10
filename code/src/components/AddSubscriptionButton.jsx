import React from "react";
import { PlusCircle } from "lucide-react";

export function AddSubscriptionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-[#1d1d1d] text-[#d7d7d7] rounded-full p-4 shadow-lg hover:bg-[#2d2d2d] transition-colors"
    >
      <PlusCircle size={24} />
    </button>
  );
}
