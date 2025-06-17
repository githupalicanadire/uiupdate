# Identity Service Guide 🔐

## Overview

IdentityServer4 tabanlı kimlik doğrulama servisi mikroservis mimarisine entegre edildi. Bu servis JWT token tabanlı authentication sağlıyor.

## Services & Ports

| Service      | Port | URL                   |
| ------------ | ---- | --------------------- |
| Identity.API | 6007 | http://localhost:6007 |
| Catalog.API  | 6000 | http://localhost:6000 |
| Basket.API   | 6001 | http://localhost:6001 |
| Ordering.API | 6003 | http://localhost:6003 |
| API Gateway  | 6004 | http://localhost:6004 |
| React App    | 6006 | http://localhost:6006 |

## Demo Users 👥

Sistem başlatıldığında otomatik olarak oluşturulan test kullanıcıları:

### 🛠️ Admin User

- **Username:** `admin`
- **Password:** `Admin123!`
- **Email:** `admin@shopping.com`
- **Role:** `admin`

### 👤 Demo Users

| Username  | Password       | Email                  | Name          | Role       | Customer ID                            |
| --------- | -------------- | ---------------------- | ------------- | ---------- | -------------------------------------- |
| `swn`     | `Password123!` | `swn@shopping.com`     | Demo User     | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afa6` |
| `alice`   | `Customer123!` | `alice@shopping.com`   | Alice Johnson | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afa7` |
| `bob`     | `Customer123!` | `bob@shopping.com`     | Bob Wilson    | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afa8` |
| `emily`   | `Customer123!` | `emily@shopping.com`   | Emily Davis   | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afa9` |
| `michael` | `Customer123!` | `michael@shopping.com` | Michael Brown | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afaa` |
| `sarah`   | `Customer123!` | `sarah@shopping.com`   | Sarah Miller  | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afab` |
| `david`   | `Customer123!` | `david@shopping.com`   | David Garcia  | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afac` |
| `lisa`    | `Customer123!` | `lisa@shopping.com`    | Lisa Anderson | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afad` |
| `john`    | `Customer123!` | `john@shopping.com`    | John Taylor   | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afae` |
| `maria`   | `Customer123!` | `maria@shopping.com`   | Maria Lopez   | `customer` | `3fa85f64-5717-4562-b3fc-2c963f66afaf` |

## 🛒 Sample Data

### Basket Data

Aşağıdaki kullanıcıların sepetlerinde örnek ürünler bulunuyor:

- **alice**: 2x Teddy Bear, 1x Racing Car
- **bob**: 1x Art Set
- **emily**: 3x Puzzle Game, 1x Space Rocket, 1x Teddy Bear
- **sarah**: 2x Board Game
- **david**: 1x Building Blocks, 1x Magic Set

### Order Data

Her kullanıcı için 1-3 adet örnek sipariş oluşturuldu. Farklı durumlarda (Pending, Completed, Cancelled) siparişler mevcut.

## 🧪 Testing Different Users

### Frontend Debug Panel

React uygulamasında `/debug` sayfasını kullanarak:

1. Farklı kullanıcılar arasında geçiş yapabilirsiniz
2. Kullanıcı sepetlerini görüntüleyebilirsiniz
3. API endpoint bilgilerini kontrol edebilirsiniz

### Programmatic User Switching

```javascript
// Import user config
import { switchDemoUser, getCurrentUser } from "../config/userConfig";

// Switch to a different user
switchDemoUser("alice");

// Get current user
const currentUser = getCurrentUser();
```

## 🚀 Starting the System

1. **Docker Compose ile:**

```bash
cd src
docker-compose up --build
```

2. **Manual olarak servisler:**

```bash
# Identity Service
cd src/Services/Identity/Identity.API
dotnet run

# Basket Service
cd src/Services/Basket/Basket.API
dotnet run

# Catalog Service
cd src/Services/Catalog/Catalog.API
dotnet run

# Ordering Service
cd src/Services/Ordering/Ordering.API
dotnet run

# API Gateway
cd src/ApiGateways/YarpApiGateway
dotnet run

# React App (already running on dev server)
```

## 🔑 IdentityServer4 Configuration

### API Scopes

- `catalog` - Catalog Service erişimi
- `basket` - Basket Service erişimi
- `ordering` - Ordering Service erişimi
- `gateway` - API Gateway erişimi
- `shopping` - Tüm servislere tam erişim

### Clients

- **shopping-spa**: React SPA client (PKCE flow)
- **gateway-client**: API Gateway machine-to-machine
- **service clients**: Her mikroservis için ayrı client

### Identity Resources

- `openid` - OpenID Connect
- `profile` - User profile bilgileri
- `email` - Email erişimi
- `roles` - User rolleri

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: SQL Server container'ın hazır olmasını bekleyin
2. **Port Conflicts**: Portların kullanılabilir olduğundan emin olun
3. **CORS Issues**: Development'ta CORS policy gevşek ayarlandı

### Logs

```bash
# Identity Service logs
docker logs identity.api

# All services logs
docker-compose logs -f
```

## 🔒 Security Notes

⚠️ **Development Only**: Bu konfigürasyon sadece development içindir. Production'da:

- Güçlü parolalar kullanın
- HTTPS zorunlu hale getirin
- Client secrets'ları güvende saklayın
- CORS policy'yi sıkılaştırın
- Rate limiting ekleyin

## 📝 Next Steps

1. **Frontend Authentication**: React uygulamasına login/logout sayfaları eklenebilir
2. **Token Management**: Automatic token refresh implementasyonu
3. **Role-based Access**: Admin paneli ve yetki kontrolü
4. **User Registration**: Self-registration özelliği
5. **Social Login**: Google, Facebook vb. entegrasyonu
