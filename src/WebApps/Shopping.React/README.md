# 🧸 ToyLand React Frontend 🎮

Bu proje, ToyLand oyuncak mağazasının React frontend uygulamasıdır.

## 🎯 Özellikler

- 🎨 Renkli ve eğlenceli oyuncak temalı tasarım
- 🧸 Modern React 18 ile geliştirilmiştir
- 📱 Responsive tasarım - mobil uyumlu
- 🚀 API Gateway üzerinden backend entegrasyonu
- 🐳 Docker container desteği
- 🎪 Çocuk dostu kullanıcı arayüzü

## API Endpoints

Uygulama aşağıdaki mikroservisleri kullanır:

- **Catalog Service**: Ürün bilgileri
- **Basket Service**: Sepet yönetimi
- **Ordering Service**: Sipariş yönetimi

## Çalıştırma

### Development Mode

```bash
npm start
```

### Docker ile

```bash
docker-compose up shopping.react
```

## Port Bilgileri

- Development: http://localhost:3000
- Production (Docker): http://localhost:6006

## Teknik Detaylar

- React Router DOM ile routing
- Axios ile API istekleri
- CSS Modules ile stil yönetimi
- Nginx ile production serving
