
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

// Use the publishable key from environment variables
const PUBLISHABLE_KEY = "pk_test_ZXBpYy1zYXdmbHktMTAuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      allowedRedirectOrigins={[
        "https://epic-sawfly-10.clerk.accounts.dev",
        "https://ecom-easyhub.lovable.app"
      ]}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
