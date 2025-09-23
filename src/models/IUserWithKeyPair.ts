import { IVerMethodKeyPair } from "./IVerMethodKeyPair";

/**
 * User object containing DID and key pair.
 */
export interface IUserWithKeyPair {
  /**
   * Email address of the user.
   */
  emailAddress: string;

  /**
   * User password.
   */
  password: string;

  /**
   * User role.
   */
  role: string;

  /**
   * DID identity string.
   */
  identity: string;

  /**
   * Verification method key pair.
   */
  verMethodKeyPair: IVerMethodKeyPair;
}
