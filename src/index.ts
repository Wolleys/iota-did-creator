import { ConfigManager } from "./config";
import { DidService, VaultService, FaucetService } from "./services";

// Configuration is now auto-initialized when first accessed
// through ConfigManager.getConfig()

// Automatically initialize required instances on first use
VaultService.getInstance();
FaucetService.getInstance();

// Export DidService for convenient usage
export const didService = DidService.getInstance();

// Export ConfigManager so consumers can override before using services
export { ConfigManager };

// Export types for consumers
export type { ICreateDidOptions, ICreateDidResponse, IUserWithKeyPair, IVerMethodKeyPair } from "./models";

// Export Network enum for convenience
export { Network } from "./config/IConfigManager";