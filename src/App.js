import React, { useEffect } from "react";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import allProducts from "./data/products";
import "./App.css";

export default function App() {

  useEffect(() => {

    // Prevent loading script multiple times
    if (document.getElementById("sf-embedded-bootstrap")) return;

    window.initEmbeddedMessaging = function () {
      try {

        window.embeddedservice_bootstrap.settings.language = "en_US";

        window.embeddedservice_bootstrap.init(
          "00DKd000004WqB4", // Org Id
          "shopease_test_2", // Deployment Name
          "https://hibizdemo.my.site.com/ESWshopeasetest21773312607792", // Site URL
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
      "https://hibizdemo.my.site.com/ESWshopeasetest21773312607792/assets/js/bootstrap.min.js";

    script.onload = () => {
      window.initEmbeddedMessaging();
    };

    script.onerror = () => {
      console.error("Failed to load Salesforce Embedded Messaging.");
    };

    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById("sf-embedded-bootstrap");
      if (existing) document.body.removeChild(existing);
    };

  }, []);

  return (
    <div className="app">
      <Hero />
      <ProductGrid products={allProducts} />
      <Footer />
    </div>
  );
}