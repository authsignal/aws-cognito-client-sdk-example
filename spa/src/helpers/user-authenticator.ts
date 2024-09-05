import {VerificationMethod} from "@/api/types";
import {
  Authenticator,
  EmailMagicLinkAuthenticator,
  IProovAuthenticator,
  AuthenticatorAppAuthenticator,
  PushAuthenticator,
  SecurityKeyAuthenticator,
  SmsAuthenticator,
  VeriffAuthenticator,
  PasskeyAuthenticator,
  EmailOtpAuthenticator,
} from "@/api/userAuthenticator/types";

function getMostSecureVerificationMethod(allowedVerificationMethods: VerificationMethod[]) {
  if (allowedVerificationMethods.includes(VerificationMethod.PASSKEY)) {
    return VerificationMethod.PASSKEY;
  }

  if (allowedVerificationMethods.includes(VerificationMethod.SECURITY_KEY)) {
    return VerificationMethod.SECURITY_KEY;
  }

  if (allowedVerificationMethods.includes(VerificationMethod.AUTHENTICATOR_APP)) {
    return VerificationMethod.AUTHENTICATOR_APP;
  }

  if (allowedVerificationMethods.includes(VerificationMethod.EMAIL_OTP)) {
    return VerificationMethod.EMAIL_OTP;
  }

  if (allowedVerificationMethods.includes(VerificationMethod.EMAIL_MAGIC_LINK)) {
    return VerificationMethod.EMAIL_MAGIC_LINK;
  }

  if (allowedVerificationMethods.includes(VerificationMethod.SMS)) {
    return VerificationMethod.SMS;
  }

  return null;
}

function isAuthenticatorAppAuthenticator(authenticator: Authenticator): authenticator is AuthenticatorAppAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.AUTHENTICATOR_APP;
}

function isSmsAuthenticator(authenticator: Authenticator): authenticator is SmsAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.SMS;
}

function isEmailMagicLinkAuthenticator(authenticator: Authenticator): authenticator is EmailMagicLinkAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.EMAIL_MAGIC_LINK;
}

function isEmailOtpAuthenticator(authenticator: Authenticator): authenticator is EmailOtpAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.EMAIL_OTP;
}

function isSecurityKeyAuthenticator(authenticator: Authenticator): authenticator is SecurityKeyAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.SECURITY_KEY;
}

function isPasskeyAuthenticator(authenticator: Authenticator): authenticator is PasskeyAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.PASSKEY;
}

function isPushAuthenticator(authenticator: Authenticator): authenticator is PushAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.PUSH;
}

function isIProovAuthenticator(authenticator: Authenticator): authenticator is IProovAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.IPROOV;
}

function isVeriffAuthenticator(authenticator: Authenticator): authenticator is VeriffAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.VERIFF;
}

export {
  getMostSecureVerificationMethod,
  isEmailMagicLinkAuthenticator,
  isEmailOtpAuthenticator,
  isSmsAuthenticator,
  isAuthenticatorAppAuthenticator,
  isSecurityKeyAuthenticator,
  isPasskeyAuthenticator,
  isPushAuthenticator,
  isIProovAuthenticator,
  isVeriffAuthenticator,
};
