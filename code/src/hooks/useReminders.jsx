import { useState, useEffect } from "react";
import { getNextPaymentDate } from "../utils/dateUtils";

export function useReminders(subscriptions) {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
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

    checkReminders();
  }, [subscriptions]);

  return { reminders };
}
