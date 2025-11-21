# Basket Service API Fixes

## Issues Identified

### 1. API Data Structure Mismatch

**Problem**: The React frontend was sending POST requests with incorrect data structure to the .NET Basket API.

**Frontend was sending**:

```json
{
  "userName": "swn",
  "items": [...]
}
```

**Backend expected** (StoreBasketRequest):

```json
{
  "cart": {
    "userName": "swn",
    "items": [...]
  }
}
```

### 2. Response Structure Mismatch

**Problem**: The GET basket response structure wasn't properly handled.

**Backend returns** (GetBasketResponse):

```json
{
  "cart": {
    "userName": "swn",
    "items": [...],
    "totalPrice": 123.45
  }
}
```

**Frontend was expecting** direct basket object without the `cart` wrapper.

### 3. Checkout Data Structure

**Problem**: Similar issue with checkout endpoint.

**Backend expected** (CheckoutBasketRequest):

```json
{
  "basketCheckoutDto": {
    "userName": "swn",
    "customerId": "..."
    // ... other checkout fields
  }
}
```

## Fixes Applied

### 1. Fixed basketService.js

- ✅ Updated `storeBasket()` to wrap data in `cart` property
- ✅ Updated `getBasket()` to handle response with `cart` property
- ✅ Updated `checkoutBasket()` to wrap data in `basketCheckoutDto` property

### 2. Created User Configuration

- ✅ Added `src/config/userConfig.js` for centralized user management
- ✅ Updated all pages to use `getCurrentUser()` instead of hardcoded "swn"
- ✅ Added `getCurrentCustomerId()` for checkout process

### 3. Fixed ESLint Warnings

- ✅ Fixed useEffect dependency warnings in CheckoutPage and CartPage

## API Endpoint Summary

| Method | Frontend URL                        | Backend Endpoint     | Request Structure              |
| ------ | ----------------------------------- | -------------------- | ------------------------------ |
| GET    | `/basket-service/basket/{userName}` | `/basket/{userName}` | -                              |
| POST   | `/basket-service/basket`            | `/basket`            | `{ cart: {...} }`              |
| POST   | `/basket-service/basket/checkout`   | `/basket/checkout`   | `{ basketCheckoutDto: {...} }` |
| DELETE | `/basket-service/basket/{userName}` | `/basket/{userName}` | -                              |

## User "swn"

This is a **demo user** that's intentionally hardcoded for testing purposes. The user "swn" doesn't need to exist in any user management system - it's just a string identifier used for the shopping cart.

## Testing

The fixes should resolve:

- ❌ 500 errors on POST `/api/basket-service/basket`
- ❌ 404 errors on GET requests (if basket exists)
- ❌ Checkout functionality issues

## Next Steps

1. Test adding items to cart from Products page
2. Test viewing cart on Cart page
3. Test checkout process
4. If needed, change the demo user by updating `USER_CONFIG.DEMO_USERNAME` in `userConfig.js`
