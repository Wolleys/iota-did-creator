import type { IDidDocument } from "@twin.org/standards-w3c-did";

/**
 * DID creation response.
 */
export interface ICreateDidResponse {
  /**
   * The DID document.
   */
  didDocument: IDidDocument;

  /**
   * Blockchain address.
   */
  address: string;

  /**
   * User email.
   */
  email: string;
}
