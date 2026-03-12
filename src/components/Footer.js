import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cols">
        <div>
          <h4>🛍️ ShopEase</h4>
          <p>Your one-stop fashion destination. Quality products delivered to your door.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li><li>Men</li><li>Women</li><li>Kids</li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>support@shopease.in</p>
          <p>+91 98765 43210</p>
          <p>Chennai, Tamil Nadu</p>
        </div>
      </div>
      <p className="footer-copy">© 2026 ShopEase. All rights reserved.</p>
    </footer>
  );
}
