import { FaucetConnectorFactory } from "@twin.org/wallet-models";
import { IotaFaucetConnector } from "@twin.org/wallet-connector-iota";
import { ConfigManager } from "../config/ConfigManager";

/**
 * Service for managing Faucet connector instances.
 */
export class FaucetService {
  /**
   * Singleton instance of FaucetService.
   * @internal
   */
  private static instance: FaucetService;

  /**
   * Underlying faucet connector instance.
   * @internal
   */
  private connector: IotaFaucetConnector;

  /**
   * Private constructor to enforce singleton pattern.
   * @internal
   * @throws Error if faucet is not available for the selected network.
   */
  private constructor() {
    const config = ConfigManager.getConfig();

    if (!config.faucetEndpoint) {
      throw new Error(`No faucet available for network: ${config.name}`);
    }

    this.connector = new IotaFaucetConnector({
      config: {
        clientOptions: { url: config.nodeEndpoint },
        network: config.name,
        endpoint: config.faucetEndpoint
      }
    });

    FaucetConnectorFactory.register("faucet", () => this.connector);
  }

  /**
   * Get the singleton instance of FaucetService.
   * @returns The singleton FaucetService instance.
   */
  public static getInstance(): FaucetService {
    if (!FaucetService.instance) {
      FaucetService.instance = new FaucetService();
    }
    return FaucetService.instance;
  }

  /**
   * Get the underlying Faucet connector.
   * @returns The IotaFaucetConnector instance.
   */
  public getConnector(): IotaFaucetConnector {
    return this.connector;
  }
}
