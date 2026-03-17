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


  // ── 2. Generic Agentforce Context Bridge ───────────────────────────
  useEffect(() => {
    const handleAgentContext = (event) => {
      if (!window.embeddedservice_bootstrap?.utilAPI?.sendTextMessage) {
        console.warn("[AgentContext] utilAPI not ready.");
        return;
      }


      window.embeddedservice_bootstrap.utilAPI.sendTextMessage(JSON.stringify(event.detail))
      .then(() => console.log("[AgentContext] Context passed:", event.detail))
      .catch((err) => console.error("[AgentContext] Failed:", err));
    };


    window.addEventListener("handleleadcreation", handleAgentContext);
    return () => window.removeEventListener("handleleadcreation", handleAgentContext);
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
