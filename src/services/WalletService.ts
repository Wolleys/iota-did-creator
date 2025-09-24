import { IotaWalletConnector } from "@twin.org/wallet-connector-iota";
import { WalletConnectorFactory, type IWalletConnector } from "@twin.org/wallet-models";
import { ConfigManager } from "../config";

/**
 * Service for managing Wallet connector instances.
 */
export class WalletService {
  /**
   * Creates a wallet connector for a given vault mnemonic identifier.
   * @param vaultMnemonicId - The vault mnemonic identifier for wallet management.
   * @returns A new IotaWalletConnector instance.
   */
  public static createWalletConnector(vaultMnemonicId: string): IWalletConnector {
    const config = ConfigManager.getConfig();

    const wallet = new IotaWalletConnector({
      config: {
        clientOptions: { url: config.nodeEndpoint },
        vaultMnemonicId,
        network: config.name,
        vaultSeedId: "default-seed",
        coinType: config.coinType
      }
    });
    WalletConnectorFactory.register(vaultMnemonicId, () => wallet);
    return wallet;
  }
}
