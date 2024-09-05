import { AuthenticatorType, ProviderType, VerificationMethod } from "../types";
import { OobChannel, SmsChannel } from "../userAuthenticator/types";

type BaseTenantAuthenticator = {
  authenticatorId: string;
  isActive: boolean;
  isEditableByUser: boolean;
  isHiddenToUser?: boolean;
  enrollmentPromptInterval?: number;
};

export type AuthenticatorAppTenantAuthenticator = BaseTenantAuthenticator & {
  authenticatorType: AuthenticatorType.OTP;
  verificationMethod: VerificationMethod.AUTHENTICATOR_APP;
  hideTotpAppDownloadScreen?: boolean;
};

export type SmsTenantAuthenticator = BaseTenantAuthenticator & {
  authenticatorType: AuthenticatorType.OOB;
  oobChannel: OobChannel.SMS;
  smsChannel: SmsChannel;
  verificationMethod: VerificationMethod.SMS;
};

type EmailMagicLinkTenantAuthenticator = BaseTenantAuthenticator & {
  authenticatorType: AuthenticatorType.OOB;
  oobChannel: OobChannel.EMAIL_MAGIC_LINK;
  verificationMethod: VerificationMethod.EMAIL_MAGIC_LINK;
};

type EmailOtpAuthenticator = BaseTenantAuthenticator & {
  authenticatorType: AuthenticatorType.OOB;
  oobChannel: OobChannel.EMAIL_OTP;
  verificationMethod: VerificationMethod.EMAIL_OTP;
};

type SecurityKeyTenantAuthenticator = BaseTenantAuthenticator & {
  authenticatorType: AuthenticatorType.SECURITY_KEY;
  verificationMethod: VerificationMethod.SECURITY_KEY;
};

type PasskeyTenantAuthenticator = BaseTenantAuthenticator & {
  authenticatorType: AuthenticatorType.PASSKEY;
  verificationMethod: VerificationMethod.PASSKEY;
};

type PushTenantAuthenticator = BaseTenantAuthenticator & {
  authenticatorType: AuthenticatorType.PUSH;
  verificationMethod: VerificationMethod.PUSH;
};

export type IProovTenantAuthenticator = BaseTenantAuthenticator & {
  authenticatorType: AuthenticatorType.PROVIDER;
  providerType: ProviderType.IPROOV;
  verificationMethod: VerificationMethod.IPROOV;
  iproov: {
    baseUrl: string;
  };
};

type VeriffTenantAuthenticator = BaseTenantAuthenticator & {
  authenticatorType: AuthenticatorType.PROVIDER;
  providerType: ProviderType.VERIFF;
  verificationMethod: VerificationMethod.VERIFF;
  veriff: {
    enrollmentPublishableKey: string;
    challengePublishableKey: string;
  };
};

export type TenantAuthenticator =
  | AuthenticatorAppTenantAuthenticator
  | SmsTenantAuthenticator
  | EmailMagicLinkTenantAuthenticator
  | EmailOtpAuthenticator
  | SecurityKeyTenantAuthenticator
  | PushTenantAuthenticator
  | IProovTenantAuthenticator
  | VeriffTenantAuthenticator
  | PasskeyTenantAuthenticator;
