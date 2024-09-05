import { useMutation } from "@tanstack/react-query";

import { useSignalApi } from "@/lib/signal-api";

type ChallengeEmailOtpBody = { userAuthenticatorId: string };

type ChallengeEmailMagicLinkResponse = {
  challengeId: string;
};

function useChallengeEmailMagicLink() {
  const { api } = useSignalApi();

  return useMutation(async (json: ChallengeEmailOtpBody) =>
    api
      .post("v1/client/challenge/email-magic-link", { json })
      .json<ChallengeEmailMagicLinkResponse>()
  );
}

export { useChallengeEmailMagicLink };
