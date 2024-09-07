import { useCallback } from "react";

import { VerificationMethod } from "@/api/types";
import { useCognitoSignIn } from "./use-cognito-sign-in";
import { VerifyEmailMagicLinkFinalizeSuccess } from "@/api";

export const VERIFICATION_METHOD_TO_CHALLENGE_ROUTE_MAP: Record<
  VerificationMethod,
  string
> = {
  [VerificationMethod.SMS]: "/challenge/sms",
  [VerificationMethod.AUTHENTICATOR_APP]: "/challenge/authenticator-app",
  [VerificationMethod.EMAIL_MAGIC_LINK]: "/challenge/email-magic-link",
  [VerificationMethod.EMAIL_OTP]: "/challenge/email-otp",
  [VerificationMethod.PASSKEY]: "/challenge/passkey",
  [VerificationMethod.SECURITY_KEY]: "/challenge/security-key",
  [VerificationMethod.PUSH]: "/challenge/push",
  [VerificationMethod.RECOVERY_CODE]: "/challenge/recovery-codes",
  [VerificationMethod.IPROOV]: "/challenge/iproov",
  [VerificationMethod.VERIFF]: "/challenge/veriff",
  [VerificationMethod.IDVERSE]: "/challenge/idverse",
} as const;

function useOnVerificationSuccess() {
  const { cognitoSignIn, isLoading: isCognitoSignInLoading } =
    useCognitoSignIn();

  const onVerificationSuccess = useCallback(
    async (response: VerifyEmailMagicLinkFinalizeSuccess) => {
      await cognitoSignIn(response.accessToken);
    },
    [cognitoSignIn]
  );

  return { onVerificationSuccess, isCognitoSignInLoading };
}

export { useOnVerificationSuccess };
