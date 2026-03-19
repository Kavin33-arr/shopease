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
          "00DKd000004WqB4",
          "shopease_test_2_1",
          "https://hibizdemo.my.site.com/ESWshopeasetest211773482987417",
          {
            scrt2URL: "https://hibizdemo.my.salesforce-scrt.com"
          }
        );
      } catch (err) {
        console.error("Error loading Embedded Messaging:", err);
      }
    };

    const script = document.createElement("script");
    script.id = "sf-embedded-bootstrap";
    script.src =
      "https://hibizdemo.my.site.com/ESWshopeasetest211773482987417/assets/js/bootstrap.min.js";
    script.onload = () => window.initEmbeddedMessaging();
    script.onerror = () =>
      console.error("Failed to load Salesforce Embedded Messaging.");
    document.body.appendChild(script);
  }, []);

  // ── 2. Generic Agentforce Context Bridge ───────────────────────────
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type !== "handleleadcreation") return;

      console.log("[postMessage] Received from LWC:", event.data.detail);

      window.embeddedservice_bootstrap.utilAPI
        .sendTextMessage(JSON.stringify(event.data.detail))
        .then((res) => console.log("[AgentContext] Sent:", res))
        .catch((err) => console.error("[AgentContext] Failed:", err));
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
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
