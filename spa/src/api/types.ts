export enum VerificationFailureReason {
  CODE_INVALID_OR_EXPIRED = "CODE_INVALID_OR_EXPIRED",
  MAX_ATTEMPTS_EXCEEDED = "MAX_ATTEMPTS_EXCEEDED",
}

export enum AuthenticatorType {
  OTP = "OTP",
  OOB = "OOB",
  SECURITY_KEY = "SECURITY_KEY",
  PASSKEY = "PASSKEY",
  PROVIDER = "PROVIDER",
  PUSH = "PUSH",
}

export enum VerificationMethod {
  SMS = "SMS",
  AUTHENTICATOR_APP = "AUTHENTICATOR_APP",
  RECOVERY_CODE = "RECOVERY_CODE",
  EMAIL_MAGIC_LINK = "EMAIL_MAGIC_LINK",
  EMAIL_OTP = "EMAIL_OTP",
  SECURITY_KEY = "SECURITY_KEY",
  PASSKEY = "PASSKEY",
  PUSH = "PUSH",
  IPROOV = "IPROOV",
  VERIFF = "VERIFF",
  IDVERSE = "IDVERSE",
}

export type RecoveryCodes = {code: string; consumedAt?: string}[];

export enum ProviderType {
  IPROOV = "IPROOV",
  VERIFF = "VERIFF",
  IDVERSE = "IDVERSE",
}

export type AuthsignalErrorResponse = {
  error: string;
  errorDescription?: string;
};
