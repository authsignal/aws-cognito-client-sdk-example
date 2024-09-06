import { useCallback } from "react";

import { VerificationMethod } from "@/api/types";
import { getRedirectUrl } from "@/store";
import { useNavigate } from "react-router-dom";
import { useCognitoSignIn } from "./use-cognito-sign-in";

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
  const navigate = useNavigate();

  const { cognitoSignIn, isLoading: isCognitoSignInLoading } =
    useCognitoSignIn();

  const onVerificationSuccess = useCallback(
    async (response: Response) => {
      console.log("onVerificationSuccess", response.accessToken);
      if (!getRedirectUrl()) {
        console.log("navigate to /callback");

        await cognitoSignIn(response.accessToken);
      }
    },
    [navigate]
  );

  return { onVerificationSuccess, isCognitoSignInLoading };
}

export { useOnVerificationSuccess };
