import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import allProducts from "./data/products";
import "./App.css";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (document.getElementById("sf-embedded-bootstrap")) return;

    // ✅ ADD THIS — Listen for topic from LWC pre-chat
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://hibizdemo.my.site.com") return;
      if (event.data?.type === "SET_PRECHAT_TOPIC") {
        const topic = event.data.topic;
        console.log("✅ Topic from LWC:", topic);
        try {
          window.embeddedservice_bootstrap.prechatAPI
            .setHiddenPrechatFields({ _subject: topic });
        } catch (e) {
          // Bootstrap not ready yet — store for later
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
        console.error("Error loading Embedded Messaging: ", err);
      }
    };

    // ✅ KEEP THIS — fallback if topic set before bootstrap ready
    window.addEventListener("onEmbeddedMessagingReady", () => {
      const topic = sessionStorage.getItem("selectedTopic");
      if (topic && window.embeddedservice_bootstrap?.prechatAPI) {
        window.embeddedservice_bootstrap.prechatAPI
          .setHiddenPrechatFields({ _subject: topic }); // ← use Hidden not Visible
        sessionStorage.removeItem("selectedTopic");
      }
    });

    const script = document.createElement("script");
    script.id = "sf-embedded-bootstrap";
    script.type = "text/javascript";
    script.src = "https://hibizdemo.my.site.com/ESWshopeasetest21773312607792/assets/js/bootstrap.min.js";
    script.onload = () => window.initEmbeddedMessaging();
    script.onerror = () => console.error("Failed to load Salesforce bootstrap script.");
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById("sf-embedded-bootstrap");
      if (existing) document.body.removeChild(existing);
    };
  }, []);
}