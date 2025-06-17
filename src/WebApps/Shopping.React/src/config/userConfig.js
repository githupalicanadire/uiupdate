// Demo user configuration
// In a real application, this would come from authentication context
export const USER_CONFIG = {
  // Demo username - you can change this to test with different users
  DEMO_USERNAME: "swn",

  // Demo customer ID for checkout
  DEMO_CUSTOMER_ID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
};

// Helper function to get current demo user
export const getCurrentUser = () => {
  return USER_CONFIG.DEMO_USERNAME;
};

// Helper function to get demo customer ID
export const getCurrentCustomerId = () => {
  return USER_CONFIG.DEMO_CUSTOMER_ID;
};
