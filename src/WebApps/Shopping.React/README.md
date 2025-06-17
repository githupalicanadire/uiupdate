# Shopping React Frontend

Bu proje, E-Shop mikroservis mimarisinin React frontend uygulamasıdır.

## Özellikler

- Modern React 18 ile geliştirilmiştir
- Responsive tasarım
- API Gateway üzerinden backend entegrasyonu
- Docker container desteği

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
