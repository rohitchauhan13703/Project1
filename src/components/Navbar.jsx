import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaCog,
  FaSignOutAlt,
  FaSignInAlt,
  FaBox,
  FaIdBadge,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setOpenDropdown(null);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ✅ Logo */}
        <div className="logo">
          <Link to="/" onClick={closeSidebar}>
            <img src="/logo3.png" alt="MyShop Logo" className="logo-img" />
          </Link>
        </div>

        {/* ✅ Hamburger Icon */}
        <div className="menu-icon" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* ✅ Desktop Navigation */}
        <ul className="nav-links desktop-only">
          <li>
            <Link to="/" onClick={closeSidebar}>Home</Link>
          </li>

          <li>
            <Link to="/shop" onClick={closeSidebar}>Shop</Link>
          </li>

          <li>
            <Link to="/cart" onClick={closeSidebar}>
              <FaShoppingCart className="icon" /> Cart
            </Link>
          </li>

          {/* ✅ Account Dropdown */}
          <li className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => handleDropdown("account")}
            >
              <FaUser className="icon" /> Account{" "}
              <FaChevronDown
                className={`down-icon ${openDropdown === "account" ? "rotate" : ""}`}
              />
            </button>

            {openDropdown === "account" && (
              <div className="dropdown-menu">
                <Link to="/login" onClick={closeSidebar}>
                  <FaSignInAlt className="icon" /> Login
                </Link>

                {/* ✅ Corrected Route */}
                <Link to="/your-profile" onClick={closeSidebar}>
                  <FaIdBadge className="icon" /> Your Profile
                </Link>

                <Link to="/orders" onClick={closeSidebar}>
                  <FaBox className="icon" /> Your Orders
                </Link>

                <Link to="/settings" onClick={closeSidebar}>
                  <FaCog className="icon" /> Settings
                </Link>

                <Link to="/logout" onClick={closeSidebar}>
                  <FaSignOutAlt className="icon" /> Logout
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* ✅ Sidebar (Mobile Menu) */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>

        <ul>
          <li>
            <Link to="/" onClick={closeSidebar}>Home</Link>
          </li>
          <li>
            <Link to="/shop" onClick={closeSidebar}>Shop</Link>
          </li>
          <li>
            <Link to="/cart" onClick={closeSidebar}>
              <FaShoppingCart className="icon" /> Cart
            </Link>
          </li>

          {/* ✅ Account Dropdown (Mobile) */}
          <li className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => handleDropdown("account")}
            >
              <FaUser className="icon" /> Account{" "}
              <FaChevronDown
                className={`down-icon ${openDropdown === "account" ? "rotate" : ""}`}
              />
            </button>

            {openDropdown === "account" && (
              <div className="dropdown-menu">
                <Link to="/login" onClick={closeSidebar}>
                  <FaSignInAlt className="icon" /> Login
                </Link>

                {/* ✅ Corrected Route for Mobile */}
                <Link to="/your-profile" onClick={closeSidebar}>
                  <FaIdBadge className="icon" /> Your Profile
                </Link>

                <Link to="/orders" onClick={closeSidebar}>
                  <FaBox className="icon" /> Your Orders
                </Link>

                <Link to="/settings" onClick={closeSidebar}>
                  <FaCog className="icon" /> Settings
                </Link>

                <Link to="/logout" onClick={closeSidebar}>
                  <FaSignOutAlt className="icon" /> Logout
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </nav>
  );
};

export default Navbar;
