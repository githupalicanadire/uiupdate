import React from "react";
import { Link } from "react-router-dom";
import "./ConfirmationPage.css";

const ConfirmationPage = () => {
  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#28a745" />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1>Sipariş Başarıyla Verildi!</h1>
        <p className="confirmation-message">
          Siparişiniz başarıyla alınmış ve işleme konmuştur. Sipariş durumunuzu
          e-posta adresinizden takip edebilirsiniz.
        </p>

        <div className="confirmation-details">
          <div className="detail-item">
            <strong>Sipariş Numarası:</strong>
            <span>
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </span>
          </div>
          <div className="detail-item">
            <strong>Sipariş Tarihi:</strong>
            <span>{new Date().toLocaleDateString("tr-TR")}</span>
          </div>
          <div className="detail-item">
            <strong>Tahmini Teslimat:</strong>
            <span>
              {new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
              ).toLocaleDateString("tr-TR")}
            </span>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/orders" className="btn btn-primary">
            Siparişlerimi Görüntüle
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
