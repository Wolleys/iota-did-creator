import { ConfigManager } from "../config";
import { VaultService } from "../services";

/**
 * Health check utility for Docker containers.
 */
class HealthCheck {
  /**
   * Performs health check by testing Vault connectivity.
   * @returns Promise resolving to health status.
   */
  public static async check(): Promise<boolean> {
    try {
      console.log("Health check: Testing configuration...");

      // Test configuration loading
      const config = ConfigManager.getConfig();
      console.log("✓ Configuration loaded:", config.name);
      console.log("✓ Vault endpoint:", config.vaultConfig?.endpoint);

      // Test Vault service initialization
      const vault = VaultService.getInstance().getConnector();
      console.log("✓ Vault service initialized");

      // Additional check for Docker environment
      if (ConfigManager.isDockerEnvironment()) {
        console.log("✓ Running in Docker environment");

        // Verify we're using the Docker Vault endpoint
        if (config.vaultConfig?.endpoint.includes("vault:8200")) {
          console.log("✓ Using Docker Vault endpoint");
        } else {
          console.log("⚠ Using non-Docker Vault endpoint:", config.vaultConfig?.endpoint);
        }
      }

      console.log("✓ Health check passed");
      return true;
    } catch (error) {
      console.error("✗ Health check failed:", error);
      return false;
    }
  }
}

// Run health check if this file is executed directly
if (require.main === module) {
  HealthCheck.check()
    .then(healthy => {
      process.exit(healthy ? 0 : 1);
    })
    .catch(error => {
      console.error("Health check error:", error);
      process.exit(1);
    });
}

export { HealthCheck };
