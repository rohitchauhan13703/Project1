import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      img: "/spider.jpg",
      title: "Spider Man Collection",
    },
    {
      id: 2,
      img: "/spider.jpg",
      title: "Venom Spider Man Collection",
      desc: "Redefining fashion with bold and comfortable designs.",
    },
    {
      id: 3,
      img: "/venom1.jpg",
      title: "Timeless Classic Wear",
      desc: "Minimalist style that never goes out of fashion.",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Spider Man White Printed T-shirt",
      img: "/1.jpg",
    },
    {
      id: 2,
      name: "Spider Man Black Printed T-shirt",
      img: "/b.jpg",
    },
    {
      id: 3,
      name: "Spider man Red Printed T-shirt",
      img: "Redback.jpg",
    },
    
  ];

  return (
    <div className="home-container">
      {/* Hero Slider */}
      <div className="home-slider">
        <Swiper
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          modules={[Navigation, Pagination, Autoplay]}
          className="mySwiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="slide">
                <img src={slide.img} alt={slide.title} className="slide-img" />
                <div className="slide-overlay" />
                <div className="slide-content">
                  <h2>{slide.title}</h2>
                  <p>{slide.desc}</p>
                  <button
                    className="shop-btn"
                    onClick={() => navigate(`/product/${slide.id}`)}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Product Grid */}
      <div className="product-section">
        <h2 className="section-title">Latest Collections</h2>
        <div className="product-grid">
          {products.map((item) => (
            <div key={item.id} className="product-card">
              <img src={item.img} alt={item.name} />
              <h3>{item.name}</h3>
              <button
                className="shop-now-btn"
             onClick={() => navigate("/shop")}
              >
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
