import React from "react";
import { Bell } from "lucide-react";

export function Reminders({ reminders }) {
  if (reminders.length === 0) return null;

  return (
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
  );
}
