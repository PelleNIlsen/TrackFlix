import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Reminders } from "./components/Reminders";
import { Calendar } from "./components/Calendar";
import { AddSubscriptionButton } from "./components/AddSubscriptionButton";
import { Footer } from "./components/Footer";
import { AddSubscriptionModal } from "./components/AddSubscriptionModal";
import { SpendingOverviewModal } from "./components/SpendingOverviewModal";
import { EditSubscriptionModal } from "./components/EditSubscriptionModal";
import { useSubscriptions } from "./hooks/useSubscriptions";
import { useCurrency } from "./hooks/useCurrency";
import { useReminders } from "./hooks/useReminders";
import {
  calculateTotalPaidAllTime,
  calculateTotalMonthlySpend,
} from "./utils/calculations";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./pages/CalendarView";
import ProtectedRoute from "./auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";

const publishableKey = "pk_test_Ym9sZC1kb2UtNzQuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Router>
        <Routes>
          <Route path="/" element={<CalendarView />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}
