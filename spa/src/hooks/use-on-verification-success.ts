import { useCallback } from "react";

import { VerificationMethod } from "@/api/types";
import { getRedirectUrl } from "@/store";
import { useNavigate } from "react-router-dom";

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

  const onVerificationSuccess = useCallback(
    (response: Response) => {
      console.log("onVerificationSuccess", response.accessToken);
      if (!getRedirectUrl()) {
        console.log("navigate to /callback");
        navigate(`/callback?token=${response.accessToken}`);
      }
    },
    [navigate]
  );

  return onVerificationSuccess;
}

export { useOnVerificationSuccess };
