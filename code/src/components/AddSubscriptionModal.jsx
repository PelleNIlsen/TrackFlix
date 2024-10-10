import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { preImplementedLogos } from "../constants/subscriptions";
import { categories } from "../constants/categories";

export function AddSubscriptionModal({ onClose, onAdd, currency }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [logo, setLogo] = useState("");
  const [category, setCategory] = useState("Other");
  const [reminderDays, setReminderDays] = useState(1);
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSubscription = {
      id: Date.now(),
      name,
      cost: parseFloat(cost),
      frequency,
      startDate: new Date(startDate).toISOString(),
      logo,
      category,
      reminderDays: parseInt(reminderDays),
    };
    onAdd(newSubscription);
    onClose();
  };

  const handleLogoSelect = (selectedLogo) => {
    setLogo(selectedLogo.url);
    setName(selectedLogo.name);
    setIsLogoDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1d1d1d] rounded-2xl p-6 w-96 text-[#d7d7d7]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Add Subscription</h2>
          <button
            onClick={onClose}
            className="text-[#6c6c6c] hover:text-[#d7d7d7]"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#2d2d2d] rounded-lg p-2 text-[#d7d7d7]"
              required
            />
          </div>
          <div>
            <label htmlFor="cost" className="block text-sm font-medium mb-1">
              Cost
            </label>
            <input
              type="number"
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full bg-[#2d2d2d] rounded-lg p-2 text-[#d7d7d7]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="frequency"
              className="block text-sm font-medium mb-1"
            >
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-[#2d2d2d] rounded-lg p-2 text-[#d7d7d7]"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium mb-1"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#2d2d2d] rounded-lg p-2 text-[#d7d7d7]"
              required
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium mb-1">
              Logo URL
            </label>
            <div className="flex flex-row">
              <input
                type="url"
                id="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full bg-[#2d2d2d] rounded-l-lg p-2 text-[#d7d7d7]"
                required
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLogoDropdownOpen(!isLogoDropdownOpen)}
                  className="bg-[#2d2d2d] text-[#d7d7d7] rounded-r-lg p-2 flex items-center h-full"
                >
                  <ChevronDown size={20} />
                </button>
                {isLogoDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-[#2d2d2d] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {preImplementedLogos.map((logo) => (
                      <button
                        key={logo.name}
                        type="button"
                        onClick={() => handleLogoSelect(logo)}
                        className="w-full text-left px-4 py-2 hover:bg-[#3d3d3d] flex items-center"
                      >
                        <img
                          src={logo.url}
                          alt={logo.name}
                          className="w-6 h-6 mr-2 rounded-full"
                        />
                        {logo.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#2d2d2d] rounded-lg p-2 text-[#d7d7d7]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="reminderDays"
              className="block text-sm font-medium mb-1"
            >
              Reminder (days before)
            </label>
            <input
              type="number"
              id="reminderDays"
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
              className="w-full bg-[#2d2d2d] rounded-lg p-2 text-[#d7d7d7]"
              min="1"
              max="30"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Subscription
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSubscriptionModal;
