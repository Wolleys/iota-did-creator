import { didService, ConfigManager } from ".";

/**
 * Demonstrates basic DID creation functionality.
 * @returns Promise resolving to the DID creation result.
 */
async function runBasicDidExample() {
  console.log("=== Example 1: Basic DID Creation ===");

  const result = await didService.createIotaDid({
    email: "test@example.com",
    walletId: "test-wallet",
    fundingAmount: 60
  });

  console.log("\n=== DID Creation Complete ===");
  console.log("Email:", result.email);
  console.log("Address:", result.address);
  console.log("DID Document ID:", result.didDocument.id);
  console.log("Full DID Document:", JSON.stringify(result.didDocument, null, 2));

  return result;
}

/**
 * Demonstrates complete user creation with DID and key pair.
 * @returns Promise resolving to the complete user object.
 */
async function runCompleteUserExample() {
  console.log("=== Example 2: Complete User Creation with Key Pair ===");

  const userWithKeys = await didService.createUserWithDid({
    email: "user@example.com",
    password: "1234",
    role: "organization",
    walletId: "user-wallet",
    fundingAmount: 60
  });

  console.log("\n=== Complete User Object ===");
  console.log(JSON.stringify(userWithKeys, null, 2));

  return userWithKeys;
}

/**
 * Main execution function that demonstrates the library functionality.
 * @throws Error if any operation fails during execution.
 */
async function main() {
  try {
    console.log("Starting IOTA DID Creator Demo...");
    console.log("Environment:", ConfigManager.isDockerEnvironment() ? "Docker" : "Local");

    // Choose which example to run
    // await runBasicDidExample();
    await runCompleteUserExample();
  } catch (error) {
    console.error("Error in main execution:", error);
    process.exit(1);
  }
}

// Run only if this file is executed directly
if (require.main === module) {
  main();
}
