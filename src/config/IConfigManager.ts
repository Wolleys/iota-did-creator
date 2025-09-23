/**
 * Enum representing supported IOTA networks.
 */
export enum Network {
  /** Mainnet for production use. */
  Mainnet = "mainnet",

  /** Testnet for testing purposes. */
  Testnet = "testnet",

  /** Development network for internal testing. */
  Devnet = "devnet",

  /** Local network for development and testing. */
  Localnet = "localnet"
}

/**
 * Interface for the network configuration and optional vault settings.
 */
export interface IConfigManager {
  /** The name of the active network. */
  name: Network;

  /** The IOTA node endpoint URL. */
  nodeEndpoint: string;

  /** Faucet endpoint URL for funding addresses (optional for mainnet). */
  faucetEndpoint?: string;

  /** Coin type for address derivation. */
  coinType: number;

  /** Vault configuration for key management. */
  vaultConfig?: {
    /** Vault server endpoint URL. */
    endpoint: string;

    /** Authentication token for vault access. */
    token: string;
  };
}
