import { VaultKeyType } from "@twin.org/vault-models";
import type { IDidDocument } from "@twin.org/standards-w3c-did";
import { HexUtils } from "../utils";
import { VaultService, WalletService, FaucetService, IdentityService } from ".";
import { ICreateDidOptions, ICreateDidResponse, IUserWithKeyPair, IVerMethodKeyPair } from "../models";

/**
 * Service for DID creation and user management.
 */
export class DidService {
  /**
   * Singleton instance of DidService.
   * @internal
   */
  private static instance: DidService;

  /**
   * Private constructor to enforce singleton usage.
   * @internal
   */
  private constructor() {}

  /**
   * Get the singleton instance of DidService.
   * @returns The shared DidService instance.
   */
  public static getInstance(): DidService {
    if (!DidService.instance) {
      DidService.instance = new DidService();
    }
    return DidService.instance;
  }

  /**
   * Create an IOTA DID, fund it, and return the DID document and address.
   * @param options - DID creation options including email, walletId, and funding amount.
   * @returns A response object containing DID document, address, and email.
   */
  public async createIotaDid(options: ICreateDidOptions): Promise<ICreateDidResponse> {
    const { email, walletId = `${email}-wallet`, fundingAmount = 60 } = options;

    console.log(`Creating IOTA DID for: ${email}`);

    // Step 1: Wallet + identity connectors
    const walletConnector = WalletService.createWalletConnector(walletId);
    const identityConnector = IdentityService.createIdentityConnector(walletId);

    // Step 2: Wallet + address
    console.log("Step 1: Creating wallet and generating address...");
    await walletConnector.create(email);
    const addresses = await walletConnector.getAddresses(email, 0, 0, 1);
    const address = addresses[0];

    // Step 3: Fund
    console.log(`Step 2: Funding address with ${fundingAmount} tokens...`);
    await FaucetService.getInstance().getConnector().fundAddress(email, address, fundingAmount);

    // Step 4: DID document
    console.log("Step 3: Creating DID document...");
    const didDocument: IDidDocument = await identityConnector.createDocument(email);

    return { didDocument, address, email };
  }

  /**
   * Retrieve or create a verification method key pair in the vault.
   * @param walletId - The wallet identifier for key retrieval.
   * @returns Promise resolving to the key pair.
   */
  public async getVerMethodKeyPair(walletId: string): Promise<IVerMethodKeyPair> {
    console.log(`Retrieving key pair from vault for wallet: ${walletId}`);

    const vaultConnector = VaultService.getInstance().getConnector();

    let keyData;
    try {
      keyData = await vaultConnector.getKey(walletId);
    } catch {
      console.log("Key not found, creating new Ed25519 key pair...");
      await vaultConnector.createKey(walletId, VaultKeyType.Ed25519);
      keyData = await vaultConnector.getKey(walletId);
    }

    const publicKey = HexUtils.uint8ArrayToHex(keyData.publicKey || keyData.privateKey);
    const privateKey = HexUtils.uint8ArrayToHex(keyData.privateKey);

    return { privateKey, publicKey };
  }

  /**
   * Creates a complete user profile with DID and cryptographic key pair.
   * @param options - Configuration options including user credentials.
   * @returns Promise resolving to the complete user object.
   */
  public async createUserWithDid(
    options: ICreateDidOptions & { password: string; role: string }
  ): Promise<IUserWithKeyPair> {
    const { email, password, role, walletId = `${email}-wallet` } = options;

    const didResult = await this.createIotaDid(options);
    const verMethodKeyPair = await this.getVerMethodKeyPair(walletId);

    return {
      emailAddress: email,
      password,
      role,
      identity: didResult.didDocument.id,
      verMethodKeyPair
    };
  }
}
