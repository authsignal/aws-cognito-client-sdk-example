type BaseAuthenticator = {
  userAuthenticatorId: string;
  createdAt: string;
  isDefault: boolean;
};

enum AuthenticatorType {
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

export type AuthenticatorAppAuthenticator = BaseAuthenticator & {
  authenticatorType: AuthenticatorType.OTP;
  verificationMethod: VerificationMethod.AUTHENTICATOR_APP;
};

export enum OobChannel {
  SMS = "SMS",
  EMAIL_MAGIC_LINK = "EMAIL_MAGIC_LINK",
  EMAIL_OTP = "EMAIL_OTP",
}

export enum SmsChannel {
  DEFAULT = "DEFAULT",
  WHATSAPP = "WHATSAPP",
}

export type SmsAuthenticator = BaseAuthenticator & {
  authenticatorType: AuthenticatorType.OOB;
  oobChannel: OobChannel.SMS;
  previousSmsChannel: SmsChannel;
  verificationMethod: VerificationMethod.SMS;
  phoneNumber: string;
};

export type EmailMagicLinkAuthenticator = BaseAuthenticator & {
  authenticatorType: AuthenticatorType.OOB;
  oobChannel: OobChannel.EMAIL_MAGIC_LINK;
  verificationMethod: VerificationMethod.EMAIL_MAGIC_LINK;
  email: string;
};

export type EmailOtpAuthenticator = BaseAuthenticator & {
  authenticatorType: AuthenticatorType.OOB;
  oobChannel: OobChannel.EMAIL_OTP;
  verificationMethod: VerificationMethod.EMAIL_OTP;
  email: string;
};

export type Authenticator =
  | AuthenticatorAppAuthenticator
  | SmsAuthenticator
  | EmailMagicLinkAuthenticator
  | EmailOtpAuthenticator;

type VerifyDeviceSuccess = {
  isVerified: true;
  accessToken: string;
  deviceId: string;
  userAuthenticatorId: string;
  recoveryCodes?: string;
};
type VerifyDeviceFailure = { isVerified: false };

export type VerifyDeviceResult = VerifyDeviceSuccess | VerifyDeviceFailure;
