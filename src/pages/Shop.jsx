import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Shop.css";

export default function Shop() {
  const navigate = useNavigate();
  const categoryRef = useRef(null); // 🔹 reference for scroll

  const clothes = [
    {
      id: 1,
      title: "Spider Man White Printed T-shirt",
      image:
        "1.jpg",
      price: "₹699",
    },
    {
      id: 2,
      title: "Spider Man Black Printed T-shirt",
      image:
        "b.jpg",
      price: "₹699",
    },
    {
      id: 3,
      title: "Spider Man Red Printed T-shirt",
      image:
        "Redback.jpg",
      price: "₹699",
  
    },
  ];

  const handleShopNow = (id) => {
    navigate(`/product/${id}`);
  };

  // 🔹 Scroll to category section
  const scrollToCategory = () => {
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="shop-page">
      {/* 🔸 Banner Section */}
      <section className="shop-banner">
        <div className="shop-content">
          <h1 className="shop-title">Shop the Latest Clothing</h1>
          <p className="shop-subtitle">
            Explore <span>Trendy Styles</span> for Every Occasion
          </p>
          <button className="shop-btn" onClick={scrollToCategory}>
            Explore Now
          </button>
        </div>
        <div className="shop-image">
          <img src="/logo3.png" alt="Shop Banner" className="banner-img" />
        </div>
      </section>

      {/* 🔸 Category Section */}
      <section className="category-section" ref={categoryRef}>
        <h2 className="section-title">Popular Clothing Collections</h2>
        <div className="category-grid">
          {clothes.map((item) => (
            <div key={item.id} className="category-card">
              <img src={item.image} alt={item.title} />
              <div className="category-overlay">
                <p>{item.title}</p>
                <span className="price">{item.price}</span>
                <button
                  className="buy-btn"
                  onClick={() => handleShopNow(item.id)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
