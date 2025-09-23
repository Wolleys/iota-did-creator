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
  }

  /**
   * Get the currently active configuration.
   * @returns The active configuration instance.
   * @throws Error if no network has been selected.
   */
  public static getConfig(): IConfigManager {
    if (!this.current) {
      throw new Error("No network selected. Call ConfigManager.useNetwork() first.");
    }
    return this.current;
  }
}
