import React, { useState } from "react";

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <div className="product-img-wrapper">
        <img src={product.image} alt={product.name} />
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="product-meta">
          <span className="product-price">₹{product.price}</span>
          <span className="product-rating">⭐ {product.rating}</span>
        </div>
        <button className={`add-btn ${added ? "added" : ""}`} onClick={handleAdd}>
          {added ? "✔ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
