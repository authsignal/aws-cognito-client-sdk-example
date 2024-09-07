import { useQuery } from "@tanstack/react-query";

import { useOnVerificationSuccess } from "@/hooks/use-on-verification-success";
import { useSignalApi } from "@/lib/signal-api";

import { EmailMagicLinkAuthenticator } from "../userAuthenticator/types";

export type VerifyEmailMagicLinkFinalizeSuccess = {
  isVerified: true;
  accessToken: string;
  recoveryCodes?: string[];
  userAuthenticator?: EmailMagicLinkAuthenticator;
};

type VerifyEmailMagicLinkFinalizeFailure = {
  isVerified: false;
};

type VerifyEmailMagicLinkFinalizeResponse =
  | VerifyEmailMagicLinkFinalizeSuccess
  | VerifyEmailMagicLinkFinalizeFailure;

function useVerifyEmailMagicLinkFinalize() {
  const { api } = useSignalApi();

  const { onVerificationSuccess, isCognitoSignInLoading } =
    useOnVerificationSuccess();

  useQuery({
    queryKey: ["magic-link"],
    queryFn: () =>
      api
        .post(`v1/client/verify/email-magic-link/finalize`)
        .json<VerifyEmailMagicLinkFinalizeResponse>(),
    onSuccess: (response: VerifyEmailMagicLinkFinalizeResponse) => {
      if (response.isVerified) {
        onVerificationSuccess(response);
      }
    },
    refetchInterval: (data) => (data?.isVerified ? false : 1000),
    refetchIntervalInBackground: true,
    cacheTime: 0, // Do not cache the result to ensure that each individual magic link is verified
  });

  return {
    isCognitoSignInLoading,
  };
}

export { useVerifyEmailMagicLinkFinalize };
