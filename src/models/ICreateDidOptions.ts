/**
 * Options for creating an IOTA DID.
 */
export interface ICreateDidOptions {
  /** Email address linked to the DID. */
  email: string;

  /** Wallet identifier. Defaults to `<email>-wallet`. */
  walletId?: string;

  /** Amount of tokens to fund the wallet with. */
  fundingAmount?: number;

  /** Optional user password. */
  password?: string;

  /** Optional user role. */
  role?: string;
}
