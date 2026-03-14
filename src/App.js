import { useEffect } from "react";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import allProducts from "./data/products";
import "./App.css";

export default function App() {
  useEffect(() => {
    // Avoid injecting the script multiple times
    if (document.getElementById("sf-embedded-bootstrap")) return;

    // Mirror the plain JS snippet's initEmbeddedMessaging
    window.initEmbeddedMessaging = function () {
      try {
        window.embeddedservice_bootstrap.settings.language = "en_US"; // en_US

        window.embeddedservice_bootstrap.init(
          "00DKd000004WqB4", // Org Id
          "shopease_test_2_1", // Deployment name from snippet
          "https://hibizdemo.my.site.com/ESWshopeasetest211773482987417", // Site URL from snippet
          {
            scrt2URL: "https://hibizdemo.my.salesforce-scrt.com", // scrt2URL from snippet
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
      "https://hibizdemo.my.site.com/ESWshopeasetest211773482987417/assets/js/bootstrap.min.js"; // Asset URL from snippet
    script.onload = () => window.initEmbeddedMessaging();
    script.onerror = () =>
      console.error("Failed to load Salesforce Embedded Messaging.");
    document.body.appendChild(script);
  }, []); // Keep for entire session

  return (
    <div className="app">
      <Hero />
      <ProductGrid products={allProducts} />
      <Footer />
    </div>
  );
}
