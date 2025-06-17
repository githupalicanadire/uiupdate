// Demo user configuration
// In a real application, this would come from authentication context
export const USER_CONFIG = {
  // Demo username - you can change this to test with different users
  DEMO_USERNAME: "swn",

  // Demo customer ID for checkout
  DEMO_CUSTOMER_ID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",

  // Available demo users with their customer IDs
  DEMO_USERS: {
    swn: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    alice: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    bob: "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    emily: "3fa85f64-5717-4562-b3fc-2c963f66afa9",
    michael: "3fa85f64-5717-4562-b3fc-2c963f66afaa",
    sarah: "3fa85f64-5717-4562-b3fc-2c963f66afab",
    david: "3fa85f64-5717-4562-b3fc-2c963f66afac",
    lisa: "3fa85f64-5717-4562-b3fc-2c963f66afad",
    john: "3fa85f64-5717-4562-b3fc-2c963f66afae",
    maria: "3fa85f64-5717-4562-b3fc-2c963f66afaf",
  },
};

// Helper function to get current demo user
export const getCurrentUser = () => {
  return USER_CONFIG.DEMO_USERNAME;
};

// Helper function to get demo customer ID
export const getCurrentCustomerId = () => {
  const currentUser = getCurrentUser();
  return USER_CONFIG.DEMO_USERS[currentUser] || USER_CONFIG.DEMO_CUSTOMER_ID;
};

// Helper function to switch demo user (useful for testing)
export const switchDemoUser = (username) => {
  if (USER_CONFIG.DEMO_USERS[username]) {
    USER_CONFIG.DEMO_USERNAME = username;
    console.log(`🔄 Switched to demo user: ${username}`);
    return true;
  }
  console.error(`❌ Demo user '${username}' not found`);
  return false;
};

// Helper function to get all available demo users
export const getAvailableDemoUsers = () => {
  return Object.keys(USER_CONFIG.DEMO_USERS);
};
