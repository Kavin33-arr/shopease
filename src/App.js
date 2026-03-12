import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import allProducts from "./data/products";
import "./App.css";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const filtered =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <div className="app">
      {/* <Navbar
        cartCount={cart.length}
        onCategoryChange={setActiveCategory}
        activeCategory={activeCategory}
      /> */}
      <Hero />
      <ProductGrid products={filtered} onAddToCart={handleAddToCart} />
      <Footer />
    </div>
  );
}
