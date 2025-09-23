import { VaultConnectorFactory } from "@twin.org/vault-models";
import { HashicorpVaultConnector } from "@twin.org/vault-connector-hashicorp";
import { ConfigManager } from "../config/ConfigManager";

/**
 * Service for managing Vault connector instances.
 */
export class VaultService {
  /**
   * Singleton instance of VaultService.
   * @internal
   */
  private static instance: VaultService;

  /**
   * Underlying vault connector instance.
   * @internal
   */
  private connector: HashicorpVaultConnector;

  /**
   * Private constructor to enforce singleton pattern.
   * @internal
   * @throws Error if vault configuration is missing.
   */
  private constructor() {
    const config = ConfigManager.getConfig();

    if (!config.vaultConfig) {
      throw new Error("Vault configuration missing. Please set vaultConfig in ConfigManager.useNetwork().");
    }

    this.connector = new HashicorpVaultConnector({
      config: config.vaultConfig
    });

    VaultConnectorFactory.register("vault", () => this.connector);
  }

  /**
   * Get the instance of VaultService.
   * @returns The singleton VaultService instance.
   */
  public static getInstance(): VaultService {
    if (!VaultService.instance) {
      VaultService.instance = new VaultService();
    }
    return VaultService.instance;
  }

  /**
   * Get the underlying Vault connector.
   * @returns The HashicorpVaultConnector instance.
   */
  public getConnector(): HashicorpVaultConnector {
    return this.connector;
  }
}
