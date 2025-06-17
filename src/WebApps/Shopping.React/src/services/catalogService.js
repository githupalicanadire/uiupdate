import api from "./api";

export const catalogService = {
  // Get all products with pagination
  getProducts: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/catalog-service/products`, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/catalog-service/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(
        `/catalog-service/products/category/${category}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }
  },
};
