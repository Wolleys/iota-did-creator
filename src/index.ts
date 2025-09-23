import { Network } from "./config/IConfigManager";
import { ConfigManager } from "./config/ConfigManager";
import { DidService, VaultService, FaucetService } from "./services";

// Default to Testnet if not already set
ConfigManager.useNetwork(Network.Testnet, {
  endpoint: process.env.VAULT_ENDPOINT ?? "http://127.0.0.1:8200",
  token: process.env.VAULT_TOKEN ?? "test-token"
});

// Automatically initialize required instances.
VaultService.getInstance();
FaucetService.getInstance();

// Export DidService for convenient usage
export const didService = DidService.getInstance();

// Export ConfigManager so consumers can override before using services
export { ConfigManager };

// Export types for consumers
export type { ICreateDidOptions, ICreateDidResponse, IUserWithKeyPair, IVerMethodKeyPair } from "./models";
