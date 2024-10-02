import React from "react";
import { X, Edit } from "lucide-react";

const SpendingOverviewModal = ({
  onClose,
  subscriptions,
  onEditSubscription,
  currency,
}) => {
  const totalMonthlySpend = subscriptions.reduce((total, sub) => {
    if (sub.endDate && new Date(sub.endDate) < new Date()) return total;
    return total + (sub.frequency === "monthly" ? sub.cost : sub.cost / 12);
  }, 0);

  const spendingByCategory = subscriptions.reduce((acc, sub) => {
    if (sub.endDate && new Date(sub.endDate) < new Date()) return acc;
    const monthlyCost = sub.frequency === "monthly" ? sub.cost : sub.cost / 12;
    acc[sub.category] = (acc[sub.category] || 0) + monthlyCost;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1d1d1d] rounded-2xl p-6 w-96 text-[#d7d7d7] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Spending Overview</h2>
          <button
            onClick={onClose}
            className="text-[#6c6c6c] hover:text-[#d7d7d7]"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Total Monthly Spend</h3>
          <p className="text-3xl font-bold text-[#d7d7d7]">
            {currency.symbol}
            {totalMonthlySpend.toFixed(2)}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
          <ul className="space-y-2">
            {Object.entries(spendingByCategory).map(([category, amount]) => (
              <li key={category} className="flex justify-between items-center">
                <span>{category}</span>
                <span>
                  {currency.symbol}
                  {amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Subscriptions</h3>
          <ul className="space-y-3">
            {subscriptions.map((sub) => (
              <li
                key={sub.id}
                className="flex items-center justify-between bg-[#0c0c0c] p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={sub.logo}
                    alt={sub.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span>{sub.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-3">
                    <span className="block text-[#6c6c6c]">
                      {currency.symbol}
                      {sub.cost.toFixed(2)} / {sub.frequency}
                    </span>
                    <span className="text-sm text-[#6c6c6c]">
                      {sub.category}
                    </span>
                  </div>
                  <button
                    onClick={() => onEditSubscription(sub)}
                    className="text-[#6c6c6c] hover:text-[#d7d7d7]"
                  >
                    <Edit size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpendingOverviewModal;
