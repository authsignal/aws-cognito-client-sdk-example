import {AuthenticatorAttachment} from "@simplewebauthn/types";
import store from "store2";

export const PASSKEY_ID_LOCAL_STORAGE_KEY = "authsignal_passkey_id" as const;

type LinkPasskeyToDeviceParams = {
  authenticatorAttachment: AuthenticatorAttachment | undefined;
  credentialId: string;
};

/**
 * If the user verifies their identity using a passkey, and it's a platform authenticator e.g. TouchID,
 * we store the passkey ID against the device. If a user has a passkey on their device, we will not
 * show them a passkey uplift prompt.
 * @param credential The response from `startRegistration` or `startAuthentication`
 */
export function linkPasskeyToDevice({authenticatorAttachment, credentialId}: LinkPasskeyToDeviceParams) {
  if (authenticatorAttachment === "cross-platform") {
    return;
  }

  store.local.set(PASSKEY_ID_LOCAL_STORAGE_KEY, credentialId);
}
