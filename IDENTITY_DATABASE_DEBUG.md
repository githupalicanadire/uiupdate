# Identity Database Debug Guide 🔍

## 🚨 Issue: IdentityServer Tables Not Created

### **Error Symptoms**:

```
SqlException: Invalid object name 'IdentityResources'
```

### **Root Cause**:

IdentityServer4 configuration tables weren't created before seed data tried to access them.

## ✅ Fixes Applied

### **1. Enhanced Migration Order**

```csharp
// Program.cs - Now migrates in correct sequence:
1. ApplicationDbContext (ASP.NET Identity tables)
2. PersistedGrantDbContext (IdentityServer operational data)
3. ConfigurationDbContext (IdentityServer configuration)
4. Seed Data (only after all tables exist)
```

### **2. Robust Seed Data with Error Handling**

```csharp
// SeedData.cs - Now includes:
- Database.EnsureCreatedAsync() calls
- Try-catch blocks for each seed operation
- Automatic migration retry if tables missing
- Detailed logging for debugging
```

### **3. Better Error Recovery**

- If IdentityResources table missing → triggers migration
- Continues seeding after successful migration
- Logs detailed error information for debugging

## 🧪 Testing Steps

### **Step 1: Clean Restart**

```bash
# Remove all containers and volumes
docker-compose down -v

# Remove any orphaned containers
docker system prune -f

# Rebuild and start fresh
docker-compose up --build
```

### **Step 2: Monitor Database Initialization**

```bash
# Watch Identity service logs specifically
docker-compose logs -f identity.api

# Look for these success indicators:
✅ "Migrating ApplicationDbContext..."
✅ "Migrating PersistedGrantDbContext..."
✅ "Migrating ConfigurationDbContext..."
✅ "Seeding identity resources..."
✅ "Admin user created successfully"
✅ "Database initialization completed successfully"
```

### **Step 3: Verify Database Tables**

```bash
# Connect to SQL Server container
docker exec -it identitydb /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P SwN12345678

# Check if IdentityServer tables exist
USE IdentityDb;
SELECT name FROM sys.tables WHERE name LIKE '%Identity%' OR name LIKE '%Client%';
GO

# Should show tables like:
# - IdentityResources
# - ApiResources
# - Clients
# - ApiScopes
```

## 🔍 Debugging Commands

### **Check Container Status**

```bash
docker ps                              # All running containers
docker-compose logs identitydb         # SQL Server logs
docker-compose logs identity.api       # Identity API logs
```

### **Database Connection Test**

```bash
# Test SQL Server connectivity
docker exec identitydb /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P SwN12345678 -Q "SELECT @@VERSION"
```

### **Manual Service Restart**

```bash
# Restart just Identity services
docker-compose restart identitydb identity.api

# Or restart everything
docker-compose restart
```

## 🎯 Expected Timeline

**First Run (Clean Build)**:

- SQL Server startup: ~30 seconds
- Identity.API first connection: ~1 minute
- Database migrations: ~30 seconds
- Seed data creation: ~15 seconds
- **Total: ~2-3 minutes**

**Subsequent Runs**:

- Database already exists: ~30 seconds startup

## ✅ Success Verification

### **1. Service Health**

- Identity.API: http://localhost:6007/health
- Should return: `{"status":"Healthy"}`

### **2. Authentication Test**

1. Go to React app: http://localhost:6006
2. Click "Kayıt Ol" (Register)
3. Create test account
4. Should successfully register and redirect to login

### **3. JWT Token Test**

```bash
# Test login endpoint directly
curl -X POST http://localhost:6004/identity-service/api/account/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

# Should return JWT token
```

## 🚨 If Still Failing

### **Nuclear Option - Full Reset**:

```bash
# Stop everything
docker-compose down -v

# Remove all Docker data
docker system prune -a -f --volumes

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

**Your Identity system should now initialize properly!** 🔐✨
