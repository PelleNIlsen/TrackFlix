import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import AddSubscriptionModal from "./components/AddSubscriptionModal";
import SpendingOverviewModal from "./components/SpendingOverviewModal";
import EditSubscriptionModal from "./components/EditSubscriptionModal";
import { PlusCircle, Bell } from "lucide-react";
import Footer from "./components/Footer";

const currencies = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "NOK", symbol: "Kr" },
  { code: "INR", symbol: "₹" },
  { code: "JPY", symbol: "¥" },
];

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSpendingModalOpen, setIsSpendingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [totalPaidAllTime, setTotalPaidAllTime] = useState(0);
  const [reminders, setReminders] = useState([]);
  const [currency, setCurrency] = useState(currencies[0]);

  useEffect(() => {
    const savedSubscriptions = localStorage.getItem("subscriptions");
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(JSON.parse(savedCurrency));
    }
  }, []);

  useEffect(() => {
    if (subscriptions.length > 0) {
      localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    } else {
      localStorage.removeItem("subscriptions");
    }
    localStorage.setItem("currency", JSON.stringify(currency));

    const calculateTotalPaid = () => {
      const now = new Date();
      let total = 0;

      subscriptions.forEach((sub) => {
        const startDate = new Date(sub.startDate);
        const endDate = sub.endDate ? new Date(sub.endDate) : now;
        const monthsDiff =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          endDate.getMonth() -
          startDate.getMonth();

        if (sub.frequency === "monthly") {
          total += sub.cost * (monthsDiff + 1);
        } else if (sub.frequency === "yearly") {
          const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
          total += sub.cost * (yearsDiff + 1);
        }
      });

      setTotalPaidAllTime(total);
    };

    calculateTotalPaid();
    checkReminders();
  }, [subscriptions, currency]);

  const addSubscription = (newSubscription) => {
    setSubscriptions((prevSubscriptions) => {
      const updatedSubscriptions = [...prevSubscriptions, newSubscription];
      localStorage.setItem(
        "subscriptions",
        JSON.stringify(updatedSubscriptions)
      );
      return updatedSubscriptions;
    });
  };

  const editSubscription = (updatedSubscription) => {
    setSubscriptions((prevSubscriptions) => {
      const updatedSubscriptions = prevSubscriptions.map((sub) =>
        sub.id === updatedSubscription.id ? updatedSubscription : sub
      );
      localStorage.setItem(
        "subscriptions",
        JSON.stringify(updatedSubscriptions)
      );
      return updatedSubscriptions;
    });
    setIsEditModalOpen(false);
    setEditingSubscription(null);
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const checkReminders = () => {
    const today = new Date();
    const newReminders = subscriptions.filter((sub) => {
      if (sub.endDate && new Date(sub.endDate) < today) return false;
      const nextPaymentDate = getNextPaymentDate(sub);
      const reminderDate = new Date(nextPaymentDate);
      reminderDate.setDate(reminderDate.getDate() - sub.reminderDays);
      return today >= reminderDate && today < nextPaymentDate;
    });
    setReminders(newReminders);
  };

  const getNextPaymentDate = (subscription) => {
    const today = new Date();
    const startDate = new Date(subscription.startDate);
    let nextPaymentDate = new Date(startDate);

    if (subscription.endDate && new Date(subscription.endDate) < today) {
      return null;
    }

    if (subscription.frequency === "monthly") {
      while (nextPaymentDate <= today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
    } else if (subscription.frequency === "yearly") {
      while (nextPaymentDate <= today) {
        nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
      }
    }

    return nextPaymentDate;
  };

  const totalMonthlySpend = subscriptions.reduce((total, sub) => {
    if (sub.endDate && new Date(sub.endDate) < new Date()) return total;
    return total + (sub.frequency === "monthly" ? sub.cost : sub.cost / 12);
  }, 0);

  return (
    <div className="min-h-screen bg-black p-8 text-[#d7d7d7]">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center">
            <img src="assets/TrackFlix.png" alt="logo" className="w-16 h-16" />
            TrackFlix
          </h1>
          <select
            value={currency.code}
            onChange={(e) =>
              setCurrency(currencies.find((c) => c.code === e.target.value))
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
                onClick={() => setIsSpendingModalOpen(true)}
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
        {reminders.length > 0 && (
          <div className="bg-yellow-800 text-yellow-100 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Bell className="mr-2" /> Upcoming Payments
            </h2>
            <ul className="mt-2">
              {reminders.map((sub) => (
                <li key={sub.id}>
                  {sub.name} - Due in {sub.reminderDays} days
                </li>
              ))}
            </ul>
          </div>
        )}
        <Calendar
          subscriptions={subscriptions}
          onEditSubscription={handleEditSubscription}
          currency={currency}
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-8 right-8 bg-[#1d1d1d] text-[#d7d7d7] rounded-full p-4 shadow-lg hover:bg-[#2d2d2d] transition-colors"
        >
          <PlusCircle size={24} />
        </button>
        <Footer />
      </div>
      {isAddModalOpen && (
        <AddSubscriptionModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addSubscription}
          currency={currency}
        />
      )}
      {isSpendingModalOpen && (
        <SpendingOverviewModal
          onClose={() => setIsSpendingModalOpen(false)}
          subscriptions={subscriptions}
          onEditSubscription={handleEditSubscription}
          currency={currency}
        />
      )}
      {isEditModalOpen && editingSubscription && (
        <EditSubscriptionModal
          subscription={editingSubscription}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={editSubscription}
          currency={currency}
        />
      )}
    </div>
  );
}

export default App;
