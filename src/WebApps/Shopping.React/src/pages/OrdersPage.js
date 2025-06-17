import React, { useState, useEffect } from "react";
import { orderingService } from "../services/orderingService";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderingService.getOrders(currentPage, pageSize);
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#ffc107";
      case "processing":
        return "#17a2b8";
      case "shipped":
        return "#007bff";
      case "delivered":
        return "#28a745";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Beklemede";
      case "processing":
        return "İşleniyor";
      case "shipped":
        return "Kargoda";
      case "delivered":
        return "Teslim Edildi";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status || "Bilinmiyor";
    }
  };

  if (loading) {
    return <div className="loading">Siparişler yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">Hata: {error}</div>;
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Siparişlerim</h1>
        <p>Geçmiş siparişlerinizi görüntüleyebilirsiniz</p>
      </div>

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Sipariş #{order.orderName || order.id}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              <div className="order-details">
                <div className="customer-info">
                  <h4>Müşteri Bilgileri</h4>
                  <p>
                    <strong>Ad:</strong> {order.shippingAddress?.firstName}{" "}
                    {order.shippingAddress?.lastName}
                  </p>
                  <p>
                    <strong>E-posta:</strong>{" "}
                    {order.shippingAddress?.emailAddress}
                  </p>
                  <p>
                    <strong>Adres:</strong> {order.shippingAddress?.addressLine}
                    , {order.shippingAddress?.state},{" "}
                    {order.shippingAddress?.country}
                  </p>
                </div>

                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="order-items">
                    <h4>Sipariş Kalemleri</h4>
                    <div className="items-list">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="order-item">
                          <span className="item-name">{item.productName}</span>
                          <span className="item-quantity">
                            x{item.quantity}
                          </span>
                          <span className="item-price">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="order-total">
                  <strong>Toplam: ${order.totalPrice}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders">
          <h2>Henüz sipariş verilmemiş</h2>
          <p>İlk siparişinizi vermek için alışverişe başlayın</p>
          <a href="/products" className="btn btn-primary">
            Ürünleri İncele
          </a>
        </div>
      )}

      {orders.length > 0 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Önceki
          </button>
          <span className="page-info">Sayfa {currentPage}</span>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={orders.length < pageSize}
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
