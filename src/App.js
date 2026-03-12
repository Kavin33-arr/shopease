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
    window.initEmbeddedMessaging = function () {
      try {
        window.embeddedservice_bootstrap.settings.language = "en_US";
        window.embeddedservice_bootstrap.init(
          "00DKd000004WqB4",
          "Shopease_test_channel",
          "https://hibizdemo.my.site.com/ESWShopeasetestchannel1773302517075",
          {
            scrt2URL: "https://hibizdemo.my.salesforce-scrt.com",
          }
        );
      } catch (err) {
        console.error("Error loading Embedded Messaging: ", err);
      }
    };

    const script = document.createElement("script");
    script.id = "sf-embedded-bootstrap";
    script.type = "text/javascript";
    script.src =
      "https://hibizdemo.my.site.com/ESWShopeasetestchannel1773302517075/assets/js/bootstrap.min.js";
    script.onload = () => window.initEmbeddedMessaging();
    script.onerror = () => console.error("Failed to load Salesforce bootstrap script.");
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
      {/* Salesforce chat button renders itself into the DOM automatically */}
    </div>
  );
}
