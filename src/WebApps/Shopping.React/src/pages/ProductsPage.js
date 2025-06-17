import React, { useState, useEffect } from "react";
import { catalogService } from "../services/catalogService";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await catalogService.getProducts(currentPage, pageSize);
      setProducts(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    // This would integrate with basket service
    console.log("Adding to cart:", product);
    alert(`🎉 ${product.name} sepetinize eklendi! 🛒`);
  };

  if (loading) {
    return <div className="loading">🎪 Oyuncaklar hazırlanıyor... ✨</div>;
  }

  if (error) {
    return (
      <div className="error">
        😔 Oyuncakları yüklerken sorun oluştu: {error}
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>🎁 Oyuncak Dünyamız 🌟</h1>
        <p>🧸 Hayal ettiğiniz her oyuncak burada! 🎮</p>
      </div>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.imageFile || "/api/placeholder/300/200"}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f0f0f0"/><text x="150" y="100" text-anchor="middle" fill="%23999" font-family="Arial, sans-serif" font-size="14">Resim Yok</text></svg>';
                  }}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">
                  {product.category?.join(", ")}
                </p>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price}</span>
                  <button
                    className="btn btn-primary add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    🛒 Sepete At!
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            🔍 Henüz oyuncak bulunmamaktadır. Yakında geliyor! 🎁
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅️ Önceki
        </button>
        <span className="page-info">📄 Sayfa {currentPage}</span>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={products.length < pageSize}
        >
          Sonraki ➡️
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
