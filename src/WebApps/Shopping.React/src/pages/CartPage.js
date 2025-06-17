import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { basketService } from "../services/basketService";
import { getCurrentUser } from "../config/userConfig";
import "./CartPage.css";

const CartPage = () => {
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo purposes, using a static username
  const userName = getCurrentUser();

  useEffect(() => {
    fetchBasket();
  }, []);

  const fetchBasket = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await basketService.getBasket(userName);
      console.log("🛒 Fetched basket:", response);
      setBasket(response);
    } catch (err) {
      console.error("❌ Basket fetch error:", err);
      setError(err.message);
      // Initialize empty basket if not found
      setBasket({
        userName: userName,
        items: [],
        totalPrice: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    try {
      const currentItem = basket.items.find(
        (item) => item.productId === productId,
      );
      if (!currentItem) return;

      const unitPrice = currentItem.price / currentItem.quantity;

      const updatedItems = basket.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, price: unitPrice * newQuantity }
          : item,
      );

      const updatedBasket = {
        ...basket,
        items: updatedItems,
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
      };

      console.log("🔄 Updating basket quantity:", updatedBasket);
      await basketService.storeBasket(updatedBasket);
      setBasket(updatedBasket);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("❌ Update quantity error:", err);
      setError(`Miktar güncellenirken hata: ${err.message}`);
    }
  };

  const removeItem = async (productId) => {
    if (
      !window.confirm(
        "Bu ürünü sepetinizden kaldırmak istediğinizden emin misiniz?",
      )
    ) {
      return;
    }

    try {
      const updatedItems = basket.items.filter(
        (item) => item.productId !== productId,
      );
      const updatedBasket = {
        ...basket,
        items: updatedItems,
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
      };

      console.log("🗑️ Removing item from basket:", productId);
      await basketService.storeBasket(updatedBasket);
      setBasket(updatedBasket);
      setError(null);
    } catch (err) {
      console.error("❌ Remove item error:", err);
      setError(`Ürün kaldırılırken hata: ${err.message}`);
    }
  };

  const clearBasket = async () => {
    if (
      !window.confirm(
        "Sepetinizdeki tüm ürünleri kaldırmak istediğinizden emin misiniz?",
      )
    ) {
      return;
    }

    try {
      console.log("🧹 Clearing basket for user:", userName);
      await basketService.deleteBasket(userName);
      setBasket({
        userName: userName,
        items: [],
        totalPrice: 0,
      });
      setError(null);
      alert("🧹 Sepetiniz temizlendi!");
    } catch (err) {
      console.error("❌ Clear basket error:", err);
      setError(`Sepet temizlenirken hata: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="loading">🛒 Sepetiniz hazırlanıyor... ✨</div>;
  }

  if (error && !basket) {
    return (
      <div className="error">😔 Sepet yüklenirken sorun oluştu: {error}</div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1>🛒 Oyuncak Sepetim 🎁</h1>
      </div>

      {basket && basket.items && basket.items.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items">
            {basket.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-info">
                  <h3>{item.productName}</h3>
                  <p className="item-color">Renk: {item.color}</p>
                </div>
                <div className="item-price">
                  <span>${(item.price / item.quantity).toFixed(2)}</span>
                  <small>birim fiyat</small>
                </div>
                <div className="item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  <span>${item.price.toFixed(2)}</span>
                  <small>toplam</small>
                </div>
                <div className="item-actions">
                  <button
                    className="btn btn-danger remove-btn"
                    onClick={() => removeItem(item.productId)}
                  >
                    🗑️ Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>🎯 Sipariş Özeti</h3>
              <div className="summary-line">
                <span>🧸 Toplam Oyuncak:</span>
                <span>{basket.items.length}</span>
              </div>
              <div className="summary-line">
                <span>📦 Toplam Adet:</span>
                <span>
                  {basket.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="summary-line total">
                <span>💰 Toplam Tutar:</span>
                <span>${basket.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="summary-actions">
                <Link to="/checkout" className="btn btn-primary checkout-btn">
                  🎉 Sipariş Ver
                </Link>
                <button
                  className="btn btn-secondary clear-btn"
                  onClick={clearBasket}
                >
                  🗑️ Sepeti Temizle
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <h2>🛒 Sepetiniz boş</h2>
          <p>🎁 En eğlenceli oyuncakları keşfetmek için alışverişe başlayın!</p>
          <Link to="/products" className="btn btn-primary">
            🧸 Oyuncakları İncele 🎮
          </Link>
        </div>
      )}

      {error && <div className="error-message">Hata: {error}</div>}
    </div>
  );
};

export default CartPage;
