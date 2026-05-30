import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/login";
import Logout from "./pages/Logout";
import Settings from "./pages/Settings";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import YourProfile from "./pages/YourProfile"; // ✅ Updated import name

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* ✅ New Profile Route */}
          <Route path="/your-profile" element={<YourProfile />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
