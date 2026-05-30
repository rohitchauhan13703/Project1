import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

// ✅ Temporary Product Data
const products = [
  {
    id: 1,
    name: "Spider Man White Printed T-shirt",
    imgs: [
      "/2.jpg",
      "/1.jpg",
      
    ],
    desc: "premium detail and finish.",
    price: 699,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Spider Man Black Printed T-shirt",
    imgs: [
      "/black.png",
      "/b.jpg",
    ],
    desc: "Soft cotton  perfect casual fit.",
    price: 699,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Stylish Hoodie",
    imgs: [
      "/Redfront.jpg",
      "/Redback.jpg",
    ],
    desc: "Comfy streetwear with premium fabric.",
    price: 2499,
    sizes: ["S", "M", "L", "XL"],
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));

  const [mainImg, setMainImg] = useState(product ? product.imgs[0] : "");
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Reviews
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    text: "",
    rating: 0,
    image: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  // ✅ Load saved reviews
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    setReviews(saved);
  }, [id]);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem(`reviews_${id}`, JSON.stringify(reviews));
  }, [reviews, id]);

  if (!product) return <h2>❌ Product not found</h2>;

  // ✅ Add to Cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("⚠️ Please select a size before adding to cart!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existing) existing.qty += qty;
    else cart.push({ ...product, img: mainImg, qty, size: selectedSize });

    localStorage.setItem("cart", JSON.stringify(cart));
    setShowPopup(true);
  };

  // ✅ Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  // ✅ Submit / Update Review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text || newReview.rating === 0) {
      alert("⚠️ Please fill all fields and select rating!");
      return;
    }

    if (editMode) {
      setReviews(
        reviews.map((r) =>
          r.id === editId
            ? { ...r, ...newReview, date: new Date().toLocaleDateString() }
            : r
        )
      );
      setEditMode(false);
      setEditId(null);
    } else {
      const reviewObj = {
        ...newReview,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
      };
      setReviews([...reviews, reviewObj]);
    }

    setNewReview({ name: "", text: "", rating: 0, image: [] });
  };

  // ✅ Edit Review
  const handleEdit = (id) => {
    const target = reviews.find((r) => r.id === id);
    setNewReview({
      name: target.name,
      text: target.text,
      rating: target.rating,
      image: target.image || [],
    });
    setEditMode(true);
    setEditId(id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // ✅ Delete Review
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  // ✅ Image Upload (only show uploaded images)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((imgs) =>
      setNewReview({ ...newReview, image: [...newReview.image, ...imgs] })
    );
  };

  return (
    <div className="product-detail-page">
      {/* 🖼️ Product Images */}
      <div className="image-section">
        <div className="thumb-column">
          {product.imgs.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="thumb"
              className={`thumb ${mainImg === img ? "active" : ""}`}
              onClick={() => setMainImg(img)}
            />
          ))}
        </div>

        <div className="main-image-box fade-in">
          <img src={mainImg} alt={product.name} className="main-image" />
        </div>
      </div>

      {/* 🛍 Product Info */}
      <div className="info-section">
        <h4 className="product-category">PREMIUM COLLECTION</h4>
        <h2 className="product-name">{product.name}</h2>
        <p className="product-desc">{product.desc}</p>
        <p className="product-price">
          MRP <span>₹{product.price.toLocaleString()}</span>
        </p>

        {/* Size */}
        <div className="size-section">
          <h5>Select Size</h5>
          <div className="size-options">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`size-btn ${
                  selectedSize === size ? "selected" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="quantity-section">
          <h5>Quantity</h5>
          <div className="qty-box">
            <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
            />
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button className="add-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy It Now
          </button>
        </div>
      </div>

      {/* ✅ Cart Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>✨ Added to cart successfully!</p>
            <button onClick={() => navigate("/cart")}>Go to Cart</button>
            <button onClick={() => setShowPopup(false)}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* ===========================
          ⭐ Customer Reviews
      =========================== */}
      <div className="reviews-section">
        <h2 className="reviews-title">
          Customer Reviews ({reviews.length})
        </h2>

        {/* ✍️ Add / Edit Review */}
        <div className="add-review">
          <h3>{editMode ? "Edit Your Review" : "Leave a Review"}</h3>
          <form onSubmit={handleSubmitReview}>
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
            />
            <textarea
              rows="4"
              placeholder="Write your review..."
              value={newReview.text}
              onChange={(e) =>
                setNewReview({ ...newReview, text: e.target.value })
              }
            />

            <div className="stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className="star"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setNewReview({ ...newReview, rating: i + 1 })
                  }
                >
                  {i < newReview.rating ? "★" : "☆"}
                </span>
              ))}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />

            {/* 🖼 Uploaded Image Previews */}
            {newReview.image && newReview.image.length > 0 && (
              <div className="preview-images">
                {newReview.image.map((img, i) => (
                  <div key={i} className="preview-thumb-box">
                    <img
                      src={img}
                      alt="preview"
                      className="preview-thumb"
                      onClick={() => setPreviewImg(img)}
                    />
                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={() =>
                        setNewReview({
                          ...newReview,
                          image: newReview.image.filter(
                            (_, index) => index !== i
                          ),
                        })
                      }
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="submit">
              {editMode ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </div>

        {/* ✅ Show Reviews */}
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div className="review-card" key={r.id}>
              <div className="review-header">
                <div className="review-user">
                  {/* ✅ Only show if user uploaded */}
                  {r.image && r.image.length > 0 && (
                    <img
                      src={r.image[0]}
                      alt="user"
                      className="review-avatar"
                    />
                  )}
                  <span className="review-name">{r.name}</span>
                </div>
                <span className="review-date">{r.date}</span>
              </div>

              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="star">
                    {i < r.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>

              <p className="review-content">{r.text}</p>

              {/* 🖼 Review Images */}
              {r.image && r.image.length > 0 && (
                <div className="review-images">
                  {r.image.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="review"
                      className="review-img"
                      onClick={() => setPreviewImg(img)}
                    />
                  ))}
                </div>
              )}

              <div style={{ marginTop: "10px", textAlign: "right" }}>
                <button
                  style={{
                    background: "transparent",
                    border: "1px solid #d5aa5b",
                    color: "#d5aa5b",
                    borderRadius: "5px",
                    padding: "4px 10px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEdit(r.id)}
                >
                  ✏️ Edit
                </button>
                <button
                  style={{
                    background: "#d5aa5b",
                    border: "none",
                    color: "black",
                    borderRadius: "5px",
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(r.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#aaa", textAlign: "center" }}>
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {/* 👁️ Full Image View */}
      {previewImg && (
        <div className="image-view-overlay" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="view" className="image-view-large" />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
