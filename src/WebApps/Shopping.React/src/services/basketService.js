import api from "./api";

export const basketService = {
  // Get basket by username
  getBasket: async (userName) => {
    try {
      const response = await api.get(`/basket-service/basket/${userName}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch basket: ${error.message}`);
    }
  },

  // Store/Update basket
  storeBasket: async (basket) => {
    try {
      const response = await api.post("/basket-service/basket", basket);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to store basket: ${error.message}`);
    }
  },

  // Delete basket
  deleteBasket: async (userName) => {
    try {
      const response = await api.delete(`/basket-service/basket/${userName}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete basket: ${error.message}`);
    }
  },

  // Checkout basket
  checkoutBasket: async (basketCheckout) => {
    try {
      const response = await api.post(
        "/basket-service/basket/checkout",
        basketCheckout,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to checkout basket: ${error.message}`);
    }
  },
};
