import { IotaIdentityConnector } from "@twin.org/identity-connector-iota";
import { ConfigManager } from "../config/ConfigManager";

/**
 * Service for managing Identity connector instances.
 */
export class IdentityService {
  /**
   * Creates an identity connector for a given vault mnemonic identifier.
   * @param vaultMnemonicId - The vault mnemonic identifier for key management.
   * @returns A new IotaIdentityConnector instance.
   */
  public static createIdentityConnector(vaultMnemonicId: string): IotaIdentityConnector {
    const config = ConfigManager.getConfig();

    return new IotaIdentityConnector({
      config: {
        clientOptions: { url: config.nodeEndpoint },
        vaultMnemonicId,
        network: config.name
      }
    });
  }
}
