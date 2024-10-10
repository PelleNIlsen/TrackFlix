import React, { useState } from "react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { useCurrency } from "../hooks/useCurrency";
import { useReminders } from "../hooks/useReminders";
import {
  calculateTotalMonthlySpend,
  calculateTotalPaidAllTime,
} from "../utils/calculations";
import { Reminders } from "../components/Reminders";
import { Calendar } from "../components/Calendar";
import { Header } from "../components/Header";
import { AddSubscriptionButton } from "../components/AddSubscriptionButton";
import { Footer } from "../components/Footer";
import AddSubscriptionModal from "../components/AddSubscriptionModal";
import SpendingOverviewModal from "../components/SpendingOverviewModal";
import EditSubscriptionModal from "../components/EditSubscriptionModal";

const CalendarView = () => {
  const { subscriptions, addSubscription, editSubscription } =
    useSubscriptions();
  const { currency, setCurrency } = useCurrency();
  const { reminders } = useReminders(subscriptions);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSpendingModalOpen, setIsSpendingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);

  const totalPaidAllTime = calculateTotalPaidAllTime(subscriptions);
  const totalMonthlySpend = calculateTotalMonthlySpend(subscriptions);

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black p-8 text-[#d7d7d7]">
      <div className="max-w-4xl mx-auto">
        <Header
          currency={currency}
          setCurrency={setCurrency}
          totalMonthlySpend={totalMonthlySpend}
          totalPaidAllTime={totalPaidAllTime}
          onOpenSpendingModal={() => setIsSpendingModalOpen(true)}
        />
        <Reminders reminders={reminders} />
        <Calendar
          subscriptions={subscriptions}
          onEditSubscription={handleEditSubscription}
          currency={currency}
        />
        <AddSubscriptionButton onClick={() => setIsAddModalOpen(true)} />
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
};

export default CalendarView;
