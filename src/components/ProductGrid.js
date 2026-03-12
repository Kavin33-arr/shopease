import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onAddToCart }) {
  return (
    <div className="product-section">
      <h2>Latest Products</h2>
      <hr />
      {products.length === 0 ? (
        <p className="no-products">No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
