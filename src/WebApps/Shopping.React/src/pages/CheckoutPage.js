import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { basketService } from "../services/basketService";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    addressLine: "",
    country: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
    paymentMethod: 1, // Credit Card
    userName: "swn", // Demo user
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const basketCheckout = {
        userName: formData.userName,
        totalPrice: 0, // This would be calculated
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        addressLine: formData.addressLine,
        country: formData.country,
        state: formData.state,
        zipCode: formData.zipCode,
        cardName: formData.cardName,
        cardNumber: formData.cardNumber,
        expiration: formData.expiration,
        cvv: formData.cvv,
        paymentMethod: formData.paymentMethod,
      };

      await basketService.checkoutBasket(basketCheckout);
      navigate("/confirmation");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="page-header">
        <h1>Sipariş Tamamla</h1>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-sections">
          <div className="form-section">
            <h2>Teslimat Bilgileri</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Ad</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Soyad</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emailAddress">E-posta</label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressLine">Adres</label>
              <input
                type="text"
                id="addressLine"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Ülke</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">Şehir</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">Posta Kodu</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Ödeme Bilgileri</h2>
            <div className="form-group">
              <label htmlFor="cardName">Kart Sahibi Adı</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Kart Numarası</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiration">Son Kullanma</label>
                <input
                  type="text"
                  id="expiration"
                  name="expiration"
                  value={formData.expiration}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {error && <div className="error-message">Hata: {error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/cart")}
          >
            Sepete Dön
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Sipariş Veriliyor..." : "Sipariş Ver"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
