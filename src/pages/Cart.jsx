import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  const navigate = useNavigate();

  // ✅ Load Cart
  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  // ✅ Sync Cart
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // ✅ Increase / Decrease Qty
  const handleQtyChange = (
    id,
    size,
    delta
  ) => {
    const updatedCart = cart
      .map((item) => {
        if (
          item.id === id &&
          item.size === size
        ) {
          return {
            ...item,
            qty: item.qty + delta,
          };
        }

        return item;
      })
      .filter((item) => item.qty > 0);

    setCart(updatedCart);
  };

  // ✅ Remove Item
  const handleRemove = (id, size) => {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item.id === id &&
          item.size === size
        )
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // ✅ Total
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  // ✅ Validation
  const validationSchema = Yup.object({
    name: Yup.string().required(
      "Full name is required"
    ),

    phone: Yup.string()
      .matches(
        /^[6-9]\d{9}$/,
        "Enter valid mobile number"
      )
      .required("Phone number required"),

    street: Yup.string().required(
      "Street address required"
    ),

    city: Yup.string().required(
      "City is required"
    ),

    pincode: Yup.string()
      .matches(
        /^\d{6}$/,
        "Enter valid pincode"
      )
      .required("Pincode required"),
  });

  // ✅ Location Fetch
  const handleLocation = (
    setFieldValue
  ) => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation not supported"
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } =
          position.coords;

        const locationText = `Lat: ${latitude.toFixed(
          4
        )}, Lng: ${longitude.toFixed(4)}`;

        setFieldValue(
          "location",
          locationText
        );

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await res.json();

          const address =
            data.address || {};

          if (address.postcode) {
            setFieldValue(
              "pincode",
              address.postcode
            );
          }

          if (
            address.city ||
            address.town ||
            address.village
          ) {
            setFieldValue(
              "city",
              address.city ||
                address.town ||
                address.village
            );
          }

          if (address.road) {
            setFieldValue(
              "street",
              address.road
            );
          }

          alert(
            "Location fetched successfully!"
          );
        } catch (error) {
          console.log(error);

          alert(
            "Failed to fetch address"
          );
        }
      },
      () => {
        alert("Location denied");
      }
    );
  };

  // ✅ Payment
  const handlePayment = (method) => {
    alert(
      `Payment Successful via ${method}`
    );

    localStorage.removeItem("cart");

    setCart([]);

    setShowPayment(false);

    navigate("/orders");
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">
        🛒 Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>
            Your cart is empty 😕
          </h2>

          <button
            className="go-shop-btn"
            onClick={() =>
              navigate("/shop")
            }
          >
            Go To Shop
          </button>
        </div>
      ) : (
        <>
          {/* ✅ Cart Items */}
          <div className="cart-list">
            {cart.map((item, index) => (
              <div
                className="cart-item"
                key={`${item.id}-${item.size}-${index}`}
              >
                {/* ❌ Remove Button */}
<div
  onClick={() =>
    handleRemove(
      item.id,
      item.size
    )
  }
  style={{
    position: "absolute",
    top: "10px",
    right: "15px",
    color: "white",
    fontSize: "35px",
    fontWeight: "bold",
    cursor: "pointer",
    zIndex: "99999",
    lineHeight: "1",
  }}
>
  ×
</div>

{/* ✅ Image */}
<img
  src={item.img}
  alt={item.name}
  className="cart-img"
/>

{/* ✅ Info */}
<div className="cart-info">
  <h3>{item.name}</h3>

  <p>
    Size:
    <strong>
      {" "}
      {item.size}
    </strong>
  </p>

  <p>
    Price: ₹
    {item.price.toLocaleString()}
  </p>

  {/* ✅ Qty */}
  <div className="qty-controls">
    <button
      className="qty-btn"
      onClick={() =>
        handleQtyChange(
          item.id,
          item.size,
          -1
        )
      }
    >
      -
    </button>

                    <span>{item.qty}</span>

                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQtyChange(
                          item.id,
                          item.size,
                          1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ✅ Price */}
                <div className="item-actions">
                  <p className="item-total">
                    ₹
                    {(
                      item.price *
                      item.qty
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Address */}
          <div className="address-box">
            <h2>
              🏠 Shipping Address
            </h2>

            <Formik
              initialValues={{
                name: "",
                phone: "",
                street: "",
                city: "",
                pincode: "",
                location: "",
              }}
              validationSchema={
                validationSchema
              }
              onSubmit={() =>
                setShowPayment(true)
              }
            >
              {({
                setFieldValue,
                values,
              }) => (
                <Form className="address-form">
                  <Field
                    name="name"
                    placeholder="Full Name"
                  />

                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error"
                  />

                  <Field
                    name="phone"
                    placeholder="Mobile Number"
                  />

                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error"
                  />

                  <Field
                    name="street"
                    placeholder="Street Address"
                  />

                  <ErrorMessage
                    name="street"
                    component="div"
                    className="error"
                  />

                  <Field
                    name="city"
                    placeholder="City"
                  />

                  <ErrorMessage
                    name="city"
                    component="div"
                    className="error"
                  />

                  <Field
                    name="pincode"
                    placeholder="Pincode"
                  />

                  <ErrorMessage
                    name="pincode"
                    component="div"
                    className="error"
                  />

                  {/* ✅ Location */}
                  <button
                    type="button"
                    className="location-btn"
                    onClick={() =>
                      handleLocation(
                        setFieldValue
                      )
                    }
                  >
                    📍 Use My Location
                  </button>

                  {values.location && (
                    <p className="live-loc">
                      {
                        values.location
                      }
                    </p>
                  )}

                  {/* ✅ Checkout */}
                  <button
                    type="submit"
                    className="checkout-btn"
                  >
                    Proceed To Payment (
                    ₹
                    {total.toLocaleString()}
                    )
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}

      {/* ✅ Payment Popup */}
      {showPayment && (
        <div className="payment-overlay">
          <div className="payment-box">
            <h2>
              Select Payment Method
            </h2>

            <button
              onClick={() =>
                handlePayment("UPI")
              }
            >
              💸 UPI
            </button>

            <button
              onClick={() =>
                handlePayment(
                  "Credit / Debit Card"
                )
              }
            >
              💳 Card
            </button>

            <button
              onClick={() =>
                handlePayment(
                  "Cash on Delivery"
                )
              }
            >
              🚚 Cash on Delivery
            </button>

            <button
              onClick={() =>
                handlePayment(
                  "Net Banking"
                )
              }
            >
              🏦 Net Banking
            </button>

            <button
              className="cancel-btn"
              onClick={() =>
                setShowPayment(false)
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}