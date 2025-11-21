# Docker Build Fix Guide 🐳

## Issues Fixed

### ✅ **Identity.API Dockerfile Path Issue**

**Problem**: Docker build was failing because of incorrect path in Dockerfile

**Solution Applied**:

```dockerfile
# Before (WRONG):
COPY ["src/Services/Identity/Identity.API/Identity.API.csproj", "src/Services/Identity/Identity.API/"]

# After (CORRECT):
COPY ["Services/Identity/Identity.API/Identity.API.csproj", "Services/Identity/Identity.API/"]
```

### ✅ **Solution File Updates**

- Added Identity.API project build configurations
- Added Identity service to nested projects hierarchy

### ✅ **JWT Authentication Added**

- Added JWT token generation to login endpoint
- Added JWT settings to appsettings.json
- Added JWT authentication middleware

## Quick Test Commands

```bash
# Navigate to src directory
cd src

# Build only Identity service to test
docker-compose build identity.api

# Build all services
docker-compose build

# Run all services
docker-compose up --build

# Run specific services for testing
docker-compose up identity.api identitydb
```

## Expected Results

✅ **Identity.API should build successfully**
✅ **All Docker services should build without errors**
✅ **Authentication endpoints should work:**

- POST `/identity-service/api/account/login`
- POST `/identity-service/api/account/register`
- GET `/identity-service/api/account/profile` (with JWT token)

## Test Authentication Flow

1. **Start services**: `docker-compose up --build`
2. **Open React app**: http://localhost:6006
3. **Register new user**: Click "Kayıt Ol"
4. **Login**: Use registered credentials
5. **Test protected routes**: Cart, Orders, Checkout

## Service URLs

| Service      | URL                   | Port |
| ------------ | --------------------- | ---- |
| React App    | http://localhost:6006 | 6006 |
| Identity.API | http://localhost:6007 | 6007 |
| API Gateway  | http://localhost:6004 | 6004 |
| Catalog.API  | http://localhost:6000 | 6000 |
| Basket.API   | http://localhost:6001 | 6001 |
| Ordering.API | http://localhost:6003 | 6003 |

## Troubleshooting

If build still fails:

1. Check Docker is running
2. Clean build: `docker-compose down && docker system prune -f`
3. Rebuild: `docker-compose up --build`
4. Check logs: `docker-compose logs identity.api`
