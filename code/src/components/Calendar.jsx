import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { useCurrency } from "../hooks/useCurrency";

export function Calendar({ onEditSubscription }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { subscriptions, isLoading, reloadSubscriptions } = useSubscriptions();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    reloadSubscriptions();
  }, [reloadSubscriptions]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevYear = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1)
    );
  };

  const nextYear = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1)
    );
  };

  const isSubscriptionActive = (subscription, date) => {
    const startDate = new Date(subscription.startDate);
    const endDate = subscription.endDate
      ? new Date(subscription.endDate)
      : null;
    if (date < startDate || (endDate && date > endDate)) return false;

    const dayOfMonth = startDate.getDate();
    if (subscription.frequency === "monthly") {
      return date.getDate() === dayOfMonth;
    } else if (subscription.frequency === "yearly") {
      return (
        date.getMonth() === startDate.getMonth() &&
        date.getDate() === dayOfMonth
      );
    }
    return false;
  };

  const handleEditSubscription = (subscription) => {
    onEditSubscription(subscription);
    reloadSubscriptions();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center bg-[#0c0c0c] p-4 rounded-t-2xl">
        <button
          onClick={prevYear}
          className="text-[#6c6c6c] hover:text-[#d7d7d7]"
        >
          <ChevronsLeft className="h-6 w-6" />
        </button>
        <button
          onClick={prevMonth}
          className="text-[#6c6c6c] hover:text-[#d7d7d7]"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h2 className="text-[#d7d7d7] text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="text-[#6c6c6c] hover:text-[#d7d7d7]"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        <button
          onClick={nextYear}
          className="text-[#6c6c6c] hover:text-[#d7d7d7]"
        >
          <ChevronsRight className="h-6 w-6" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1 bg-[#0c0c0c] p-1">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-[#6c6c6c] py-2 px-1 rounded-lg text-sm sm:text-base"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 p-1">
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div
              key={`empty-${index}`}
              className="sm:aspect-square bg-[#0c0c0c] rounded-lg"
            ></div>
          ))}
        {days.map((day) => {
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );
          const daySubscriptions = subscriptions.filter((sub) =>
            isSubscriptionActive(sub, date)
          );
          const isActive =
            daySubscriptions.length > 0 ||
            date.toDateString() === new Date().toDateString();
          return (
            <div
              key={day}
              className={`sm:aspect-square ${
                isActive ? "bg-[#1d1d1d]" : "bg-[#0c0c0c]"
              } rounded-lg p-2 flex flex-col items-center justify-between`}
            >
              <span className="text-sm font-medium text-[#d7d7d7]">{day}</span>
              <div className="flex flex-wrap justify-center gap-1">
                {daySubscriptions.map((sub) => (
                  <img
                    key={sub.id}
                    src={sub.logo}
                    alt={sub.name}
                    className="w-4 h-4 sm:w-6 sm:h-6 mt-2 sm:mt-0 rounded-full cursor-pointer"
                    onClick={() => handleEditSubscription(sub)}
                    title={`${sub.name} - ${currency.symbol}${sub.cost}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
