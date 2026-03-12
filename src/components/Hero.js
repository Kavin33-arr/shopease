import React, { useState } from "react";

export default function Navbar({ cartCount, onCategoryChange, activeCategory }) {
  const categories = ["All", "Men", "Women", "Kids"];

  return (
    <nav className="navbar">
      <div className="nav-logo">🛍️ ShopEase</div>
      <ul className="nav-links">
        {categories.map((cat) => (
          <li
            key={cat}
            className={activeCategory === cat ? "active" : ""}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
      <div className="nav-cart">
        🛒 Carts <span className="cart-badge">{cartCount}</span>
      </div>
    </nav>
  );
}
