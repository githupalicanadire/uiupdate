import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>E-Shop Microservices</h1>
          <p>
            Modern bir mikroservis mimarisi ile geliştirilmiş e-ticaret
            platformu
          </p>
          <Link to="/products" className="btn btn-primary hero-btn">
            Ürünleri Keşfet
          </Link>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Özellikler</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Mikroservis Mimarisi</h3>
              <p>Ölçeklenebilir ve bakımı kolay mikroservis yapısı</p>
            </div>
            <div className="feature-card">
              <h3>React Frontend</h3>
              <p>
                Modern React teknolojisi ile geliştirilmiş kullanıcı arayüzü
              </p>
            </div>
            <div className="feature-card">
              <h3>API Gateway</h3>
              <p>YARP ile güçlendirilmiş API Gateway</p>
            </div>
            <div className="feature-card">
              <h3>Docker Container</h3>
              <p>Docker ile kolayca deploy edilebilir yapı</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
