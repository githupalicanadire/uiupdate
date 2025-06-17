import api from "./api";

export const orderingService = {
  // Get orders with pagination
  getOrders: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await api.get("/ordering-service/orders", {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  },

  // Get orders by customer
  getOrdersByCustomer: async (customerId) => {
    try {
      const response = await api.get(
        `/ordering-service/orders/customer/${customerId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch customer orders: ${error.message}`);
    }
  },

  // Get orders by name
  getOrdersByName: async (name) => {
    try {
      const response = await api.get(`/ordering-service/orders/name/${name}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch orders by name: ${error.message}`);
    }
  },

  // Create order
  createOrder: async (order) => {
    try {
      const response = await api.post("/ordering-service/orders", order);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  },

  // Update order
  updateOrder: async (order) => {
    try {
      const response = await api.put("/ordering-service/orders", order);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }
  },

  // Delete order
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/ordering-service/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }
  },
};
