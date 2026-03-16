import { useEffect } from "react";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import ChatFeedback from "./components/ChatFeedback";
import allProducts from "./data/products";
import "./App.css";

export default function App() {
  useEffect(() => {
    if (document.getElementById("sf-embedded-bootstrap")) return;

    window.initEmbeddedMessaging = function () {
      try {
        window.embeddedservice_bootstrap.settings.language = "en_US";
        window.embeddedservice_bootstrap.init(
          "00DKd000004WqB4",
          "Shopease_Test_3",
          "https://hibizdemo.my.site.com/ESWShopeaseTest31773480481190",
          {
            scrt2URL: "https://hibizdemo.my.salesforce-scrt.com",
          }
        );
      } catch (err) {
        console.error("Error loading Embedded Messaging:", err);
      }
    };

    const script = document.createElement("script");
    script.id = "sf-embedded-bootstrap";
    script.src =
      "https://hibizdemo.my.site.com/ESWShopeaseTest31773480481190/assets/js/bootstrap.min.js";
    script.onload = () => window.initEmbeddedMessaging();
    script.onerror = () =>
      console.error("Failed to load Salesforce Embedded Messaging.");
    document.body.appendChild(script);
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
