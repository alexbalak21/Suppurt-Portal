import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { Providers } from "./app";
import "./styles/main.css";

// Unregister any existing MSW service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      if (registration.active?.scriptURL.includes('mockServiceWorker')) {
        registration.unregister();
        console.log('MSW service worker unregistered');
      }
    });
  });
}

// Clear any stale authentication state (optional: uncomment to force logout on page load)
// localStorage.removeItem('access_token');

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
