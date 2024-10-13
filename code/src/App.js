import React, { useState, useEffect } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./pages/CalendarView";
import ProtectedRoute from "./auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import { dark } from "@clerk/themes";
import { Dashboard } from "./pages/Dashboard";
import { loadStripe } from "@stripe/stripe-js";
import { VerificationComponent } from "./auth/VerificationComponents";

const publishableKey = "pk_test_Ym9sZC1kb2UtNzQuY2xlcmsuYWNjb3VudHMuZGV2JA";

const stripePromise = loadStripe(
  "pk_test_51Q3zRsBsc6HJVesCMXSyTJdibb9S9JLIokFvp8B4jzfCH9tWJf1CGO9ReJG9hI8gXNeVBbmc7Cw1WLCpvc7bPrQ600IKgVKD7A"
);

export default function App() {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{ baseTheme: dark }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<CalendarView />} />
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/verify" element={<VerificationComponent />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}
