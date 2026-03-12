import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import allProducts from "./data/products";
import "./App.css";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const pendingTopic = useRef(null); // ✅ store topic if bootstrap not ready

  useEffect(() => {
    if (document.getElementById("sf-embedded-bootstrap")) return;

    // ✅ FIX 1 — Listen for topic from LWC via postMessage
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://hibizdemo.my.site.com") return;
      if (event.data?.type === "SET_PRECHAT_TOPIC") {
        const topic = event.data.topic;
        console.log("✅ Topic from LWC:", topic);

        try {
          // ✅ FIX 2 — Use "Subject" (capital S, matches Channel Variable Name)
          window.embeddedservice_bootstrap.prechatAPI
            .setHiddenPrechatFields({ Subject: topic });
          console.log("✅ Hidden field set immediately:", topic);
        } catch (e) {
          // Bootstrap not ready yet — store in ref for fallback
          console.warn("Bootstrap not ready, storing topic:", topic);
          pendingTopic.current = topic;
          sessionStorage.setItem("selectedTopic", topic);
        }
      }
    });

    window.initEmbeddedMessaging = function () {
      try {
        window.embeddedservice_bootstrap.settings.language = "en_US";
        window.embeddedservice_bootstrap.init(
          "00DKd000004WqB4",
          "shopease_test_2",
          "https://hibizdemo.my.site.com/ESWshopeasetest21773312607792",
          { scrt2URL: "https://hibizdemo.my.salesforce-scrt.com" }
        );
      } catch (err) {
        console.error("Error loading Embedded Messaging:", err);
      }
    };

    // ✅ FIX 3 — Fallback: apply stored topic when bootstrap becomes ready
    window.addEventListener("onEmbeddedMessagingReady", () => {
      const topic =
        pendingTopic.current || sessionStorage.getItem("selectedTopic");

      if (topic && window.embeddedservice_bootstrap?.prechatAPI) {
        // ✅ FIX 2 — Same fix: "Subject" not "_subject"
        window.embeddedservice_bootstrap.prechatAPI
          .setHiddenPrechatFields({ Subject: topic });
        console.log("✅ Hidden field set on ready:", topic);
        sessionStorage.removeItem("selectedTopic");
        pendingTopic.current = null;
      }
    });

    const script = document.createElement("script");
    script.id = "sf-embedded-bootstrap";
    script.type = "text/javascript";
    script.src =
      "https://hibizdemo.my.site.com/ESWshopeasetest21773312607792/assets/js/bootstrap.min.js";
    script.onload = () => window.initEmbeddedMessaging();
    script.onerror = () =>
      console.error("Failed to load Salesforce bootstrap script.");
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById("sf-embedded-bootstrap");
      if (existing) document.body.removeChild(existing);
    };
  }, []);

  const filtered =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <div className="app">
      <Hero />
      <ProductGrid products={filtered} onAddToCart={handleAddToCart} />
      <Footer />
    </div>
  );
}
