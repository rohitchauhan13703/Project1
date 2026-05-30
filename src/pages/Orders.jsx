import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaHeart, FaTicketAlt, FaHeadset } from "react-icons/fa";
import "./Orders.css";

const Orders = () => {
  const items = [
    { icon: <FaBoxOpen />, label: "My Orders", path: "/orders" },
    { icon: <FaHeart />, label: "Wishlist", path: "/wishlist" },
    { icon: <FaTicketAlt />, label: "Coupons", path: "/coupons" },
    { icon: <FaHeadset />, label: "Help Center", path: "/help" },
  ];

  return (
    <div className="orders-wrapper">
      <div className="orders-buttons">
        {items.map((item, index) => (
          <Link key={index} to={item.path} className="order-btn">
            <div className="order-icon">{item.icon}</div>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
