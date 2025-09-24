import dotenv from "dotenv";
import { IConfigManager, Network } from "./IConfigManager";

/**
 * Manages configuration settings for different IOTA networks.
 */
export class ConfigManager {
  /**
   * Current active configuration instance.
   * @internal
   */
  private static current: IConfigManager;

  /**
   * Flag to track if configuration has been initialized.
   * @internal
   */
  private static initialized = false;

  /**
   * Preset configurations for each supported network.
   * @internal
   */
  private static readonly NETWORKS: Record<Network, IConfigManager> = {
    [Network.Mainnet]: {
      name: Network.Mainnet,
      nodeEndpoint: "https://api.mainnet.iota.cafe",
      coinType: 4218
    },
    [Network.Testnet]: {
      name: Network.Testnet,
      nodeEndpoint: "https://api.testnet.iota.cafe",
      faucetEndpoint: "https://faucet.testnet.iota.cafe",
      coinType: 4218
    },
    [Network.Devnet]: {
      name: Network.Devnet,
      nodeEndpoint: "https://api.devnet.iota.cafe",
      faucetEndpoint: "https://faucet.devnet.iota.cafe",
      coinType: 4218
    },
    [Network.Localnet]: {
      name: Network.Localnet,
      nodeEndpoint: "http://127.0.0.1:9000",
      faucetEndpoint: "http://127.0.0.1:9123/gas",
      coinType: 4218
    }
  };

  /**
   * Automatically configure from environment variables.
   * @internal
   */
  private static autoConfigure(): void {
    if (this.initialized) return;
    dotenv.config();

    const network = this.getNetworkFromEnv();
    const vaultConfig = this.getVaultConfigFromEnv();

    this.useNetwork(network, vaultConfig);
    console.log(`Auto-configured for network: ${network}, Vault: ${vaultConfig.endpoint}`);
  }

  /**
   * Get network from environment variables.
   * @internal
   */
  private static getNetworkFromEnv(): Network {
    const networkEnv = process.env.IOTA_NETWORK;

    if (networkEnv && Object.values(Network).includes(networkEnv as Network)) {
      return networkEnv as Network;
    }

    return Network.Testnet; // Default to Testnet
  }

  /**
   * Get vault configuration from environment variables.
   * @internal
   */
  private static getVaultConfigFromEnv(): { endpoint: string; token: string } {
    return {
      endpoint: process.env.VAULT_ENDPOINT || "http://127.0.0.1:8200",
      token: process.env.VAULT_TOKEN || "test"
    };
  }

  /**
   * Select the active network configuration.
   * @param network - The IOTA network to use.
   * @param vaultConfig - Optional Vault configuration (endpoint + token).
   * @throws Error if the network is not supported.
   */
  public static useNetwork(network: Network, vaultConfig?: { endpoint: string; token: string }) {
    const baseConfig = this.NETWORKS[network];
    if (!baseConfig) {
      throw new Error(`Unknown network: ${network}`);
    }

    this.current = {
      ...baseConfig,
      vaultConfig: vaultConfig ?? baseConfig.vaultConfig
    };
    this.initialized = true;
  }

  /**
   * Get the currently active configuration.
   * @returns The active configuration instance.
   * @throws Error if no network has been selected.
   */
  public static getConfig(): IConfigManager {
    if (!this.current) {
      this.autoConfigure();
    }
    return this.current;
  }

  /**
   * Check if running in Docker environment.
   * @returns True if running in Docker.
   */
  public static isDockerEnvironment(): boolean {
    return (
      process.env.DOCKER_ENV === "true" ||
      process.env.VAULT_ENDPOINT?.includes("vault:8200") ||
      Boolean(process.env.IN_DOCKER)
    );
  }

  /**
   * Reset the configuration (mainly for testing).
   * @internal
   */
  public static reset(): void {
    this.current = undefined as any;
    this.initialized = false;
  }
}
