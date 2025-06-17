import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { basketService } from "../services/basketService";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [basket, setBasket] = useState(null);
  const [basketLoading, setBasketLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    addressLine: "",
    country: "Türkiye",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
    paymentMethod: 1, // Credit Card
    userName: "swn", // Demo user
  });

  const fetchBasket = async () => {
    try {
      setBasketLoading(true);
      const response = await basketService.getBasket(formData.userName);
      setBasket(response);

      if (!response.items || response.items.length === 0) {
        setError("Sepetiniz boş. Önce ürün ekleyin.");
        setTimeout(() => {
          navigate("/products");
        }, 3000);
      }
    } catch (err) {
      console.error("❌ Checkout basket fetch error:", err);
      setError("Sepet bilgileri alınamadı");
    } finally {
      setBasketLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!basket || !basket.items || basket.items.length === 0) {
      setError("Sepetiniz boş. Önce ürün ekleyin.");
      return;
    }

    // Form validation
    const requiredFields = [
      "firstName",
      "lastName",
      "emailAddress",
      "addressLine",
      "state",
      "zipCode",
      "cardName",
      "cardNumber",
      "expiration",
      "cvv",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field].trim(),
    );

    if (missingFields.length > 0) {
      setError(`Lütfen şu alanları doldurun: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🛒 Starting checkout process...");

      const basketCheckout = {
        userName: formData.userName,
        customerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Demo customer ID
        totalPrice: basket.totalPrice,

        // Shipping & Billing Address
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        emailAddress: formData.emailAddress.trim(),
        addressLine: formData.addressLine.trim(),
        country: formData.country.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),

        // Payment
        cardName: formData.cardName.trim(),
        cardNumber: formData.cardNumber.replace(/\s/g, ""), // Remove spaces
        expiration: formData.expiration.trim(),
        cvv: formData.cvv.trim(),
        paymentMethod: formData.paymentMethod,
      };

      console.log("💳 Checkout data:", basketCheckout);

      await basketService.checkoutBasket(basketCheckout);

      console.log("✅ Checkout successful!");

      // Store checkout data for confirmation page
      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderNumber: `TOY-${Date.now()}`,
          totalPrice: basket.totalPrice,
          itemCount: basket.items.reduce((sum, item) => sum + item.quantity, 0),
          customerName: `${formData.firstName} ${formData.lastName}`,
        }),
      );

      navigate("/confirmation");
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setError(`Sipariş tamamlanırken hata oluştu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    return <div className="loading">🛒 Sepet bilgileri yükleniyor... ✨</div>;
  }

  return (
    <div className="checkout-page">
      <div className="page-header">
        <h1>🎉 Siparişi Tamamla 🛒</h1>
      </div>

      {basket && basket.items && basket.items.length > 0 && (
        <div className="checkout-summary">
          <h3>📋 Sipariş Özeti</h3>
          <div className="summary-items">
            {basket.items.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.productName}</span>
                <span>{item.quantity} adet</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <strong>Toplam: ${basket.totalPrice.toFixed(2)}</strong>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-sections">
          <div className="form-section">
            <h2>🏠 Teslimat Bilgileri</h2>
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
            <h2>💳 Ödeme Bilgileri</h2>
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
            ⬅️ Sepete Dön
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "🎁 Sipariş Veriliyor..." : "🎉 Sipariş Ver"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;