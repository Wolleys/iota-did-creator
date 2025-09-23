import { Network } from "./config/IConfigManager";
import { didService, ConfigManager } from "./index";

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
    ConfigManager.useNetwork(Network.Testnet, {
      endpoint: process.env.VAULT_ENDPOINT ?? "http://127.0.0.1:8200",
      token: process.env.VAULT_TOKEN ?? "test-token"
    });

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
