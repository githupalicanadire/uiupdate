# Database Connection Fix Guide 🔧

## 🔍 Problem Analysis

**Issue**: Identity.API container starts but cannot connect to SQL Server database

```
SqlException: A network-related or instance-specific error occurred while establishing a connection to SQL Server
```

## ✅ Solutions Applied

### 1. **Added Database Retry Logic**

- Added 30 retry attempts with 2-second delays
- Better error logging for connection attempts
- Graceful degradation if database is slow to start

### 2. **Improved Docker Dependencies**

- Added healthcheck for `identitydb` container
- Updated `identity.api` to wait for healthy database
- Ensures database is ready before API starts

### 3. **Enhanced Configuration**

```yaml
identitydb:
  healthcheck:
    test:
      [
        "CMD-SHELL",
        "/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P SwN12345678 -Q 'SELECT 1' || exit 1",
      ]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 30s

identity.api:
  depends_on:
    identitydb:
      condition: service_healthy
```

## 🚀 How to Test

### **Step 1: Restart Docker Services**

```bash
# Stop all services
docker-compose down

# Remove any stuck containers
docker-compose down --remove-orphans

# Start fresh
docker-compose up --build
```

### **Step 2: Monitor Startup Sequence**

```bash
# Watch all logs
docker-compose logs -f

# Or watch specific services
docker-compose logs -f identitydb identity.api
```

### **Step 3: Expected Startup Flow**

1. 🔵 `identitydb` starts first
2. ⏳ Health check waits for SQL Server to be ready
3. ✅ `identitydb` becomes healthy
4. 🔵 `identity.api` starts and connects
5. ✅ Database migrations run successfully
6. 🌱 Seed data is created
7. 🚀 API is ready for requests

## 🧪 Test Authentication

Once all services are running:

1. **Access React App**: http://localhost:6006
2. **Click "Kayıt Ol"** (Register)
3. **Create new account**:
   ```
   Ad: Test
   Soyad: User
   Username: testuser
   Email: test@example.com
   Password: Test123!
   ```
4. **Login with created account**
5. **Test protected features**: Cart, Checkout, Orders

## 🔍 Troubleshooting

### **If database still fails:**

```bash
# Check database container status
docker ps
docker-compose logs identitydb

# Check database connectivity
docker exec -it identitydb /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P SwN12345678 -Q "SELECT 1"

# Manual database restart
docker-compose restart identitydb
docker-compose restart identity.api
```

### **Alternative: Use Demo User**

If database issues persist, you can still test with demo user:

- **Username**: `swn`
- **Password**: `Password123!`

## 📊 Service Startup Times

Expected startup times on first run:

- `identitydb`: ~30 seconds
- `identity.api`: ~2 minutes (with retries)
- `other services`: ~1 minute each

**Total system ready time: ~5-7 minutes for first build**

## ✅ Success Indicators

Look for these logs to confirm success:

- ✅ `identitydb` shows "SQL Server is now ready for client connections"
- ✅ `identity.api` shows "Database initialization completed successfully"
- ✅ `identity.api` shows "Admin user created successfully"
- ✅ React app accessible at http://localhost:6006

**Your authentication system should now work perfectly!** 🎉
