import { useEffect } from "react";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import ChatFeedback from "./components/ChatFeedback";
import allProducts from "./data/products";
import "./App.css";

export default function App() {

  // ── 1. Boot Salesforce Embedded Messaging ──────────────────────────
  useEffect(() => {
    if (document.getElementById("sf-embedded-bootstrap")) return;

    window.initEmbeddedMessaging = function () {
      try {
        window.embeddedservice_bootstrap.settings.language = "en_US";
        window.embeddedservice_bootstrap.init(
          "00DdL00000q2kwr",
          "Lead_Management",
          "https://orgfarm-f0fa806fff-dev-ed.develop.my.site.com/ESWLeadManagement1773644864011",
          {
            scrt2URL: "https://orgfarm-f0fa806fff-dev-ed.develop.my.salesforce-scrt.com"
          }
        );
      } catch (err) {
        console.error("Error loading Embedded Messaging:", err);
      }
    };

    const script = document.createElement("script");
    script.id = "sf-embedded-bootstrap";
    script.src =
      "https://orgfarm-f0fa806fff-dev-ed.develop.my.site.com/ESWLeadManagement1773644864011/assets/js/bootstrap.min.js";
    script.onload = () => window.initEmbeddedMessaging();
    script.onerror = () =>
      console.error("Failed to load Salesforce Embedded Messaging.");
    document.body.appendChild(script);
  }, []);

  // ── 2. Agentforce Context Bridge with Queue & Retry ────────────────
  useEffect(() => {
    const pendingQueue = [];
    let isReady = false;

    const sendMessage = (detail) => {
      window.embeddedservice_bootstrap.utilAPI
        .sendTextMessage(
          typeof detail === "string" ? detail : JSON.stringify(detail)
        )
        .then(() => console.log("[AgentContext] Sent:", detail))
        .catch((err) => console.error("[AgentContext] Failed:", err));
    };

    const flushQueue = () => {
      console.log(`[AgentContext] Flushing ${pendingQueue.length} queued message(s).`);
      while (pendingQueue.length > 0) {
        sendMessage(pendingQueue.shift());
      }
    };

    // Fires when Salesforce chat widget is fully ready
    const handleReady = () => {
      console.log("[AgentContext] onEmbeddedMessagingReady — utilAPI available.");
      isReady = true;
      flushQueue();
    };

    const handleLeadCreation = (event) => {
      const detail = event?.detail ?? event; // support both real events and queue replays
      console.log("[AgentContext] handleleadcreation received:", detail);

      if (!isReady || !window.embeddedservice_bootstrap?.utilAPI?.sendTextMessage) {
        console.warn("[AgentContext] utilAPI not ready — queuing.");
        pendingQueue.push(detail);
        return;
      }

      sendMessage(detail);
    };

    // ── Drain pre-mount buffered events from main.jsx ─────────────────
    if (window.__leadEventQueue__?.length > 0) {
      console.log(
        "[AgentContext] Draining pre-mount queue:",
        window.__leadEventQueue__
      );
      window.__leadEventQueue__.forEach((detail) => {
        handleLeadCreation({ detail });
      });
      window.__leadEventQueue__ = [];
    }

    window.addEventListener("onEmbeddedMessagingReady", handleReady);
    window.addEventListener("handleleadcreation", handleLeadCreation);

    return () => {
      window.removeEventListener("onEmbeddedMessagingReady", handleReady);
      window.removeEventListener("handleleadcreation", handleLeadCreation);
    };
  }, []);

  return (
    <div className="app">
      <Hero />
      <ProductGrid products={allProducts} />
      <Footer />
      <ChatFeedback />
    </div>
  );
}
