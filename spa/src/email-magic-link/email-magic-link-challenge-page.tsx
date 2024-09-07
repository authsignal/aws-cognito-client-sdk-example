import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  RespondToAuthChallengeCommand,
  CognitoIdentityProviderClient,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";

import { Main } from "@/components/layouts";
import { SkeletonText } from "@/components/shared/skeleton-page";
import { SuccessToast, Toaster } from "@/components/shared/toast";
import { H1, Paragraph } from "@/components/shared/typography";
import { useSignalApi } from "@/lib/signal-api";
import {
  Authenticator,
  EmailMagicLinkAuthenticator,
} from "@/api/userAuthenticator/types";
import { VerificationMethod } from "@/api/types";
import { useNavigate } from "react-router-dom";

type ChallengeEmailOtpBody = { userAuthenticatorId: string };

type ChallengeEmailMagicLinkResponse = {
  challengeId: string;
};

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

const cognitoClientId = import.meta.env.VITE_COGNITO_CLIENT_ID!;

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});

export function EmailMagicLinkChallengePage({
  initialToken,
}: {
  initialToken: string;
}) {
  const [authenticator, setAuthenticator] =
    useState<EmailMagicLinkAuthenticator | null>(null);
  const [isCognitoSignInLoading, setIsCognitoSignInLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const { api } = useSignalApi({ initialToken });

  const cognitoSignIn = useCallback(
    async (token: string) => {
      setIsCognitoSignInLoading(true);
      const session = localStorage.getItem("session");
      const username = localStorage.getItem("username");

      if (!token || !session || !username) {
        navigate("/");
        return;
      }

      const respondToAuthChallengeInput = {
        ChallengeName: ChallengeNameType.CUSTOM_CHALLENGE,
        ClientId: cognitoClientId,
        Session: session,
        ChallengeResponses: {
          USERNAME: username,
          ANSWER: JSON.stringify({ token }),
        },
      };

      const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand(
        respondToAuthChallengeInput
      );

      const response = await cognitoClient.send(respondToAuthChallengeCommand);

      localStorage.setItem("token", token);
      if (response.AuthenticationResult?.AccessToken) {
        localStorage.setItem(
          "accessToken",
          response.AuthenticationResult?.AccessToken
        );
      }

      if (response.AuthenticationResult?.RefreshToken) {
        localStorage.setItem(
          "refreshToken",
          response.AuthenticationResult?.RefreshToken
        );
      }
      setIsCognitoSignInLoading(false);
      navigate("/");
    },
    [navigate]
  );

  const sendEmailMagicLink = useCallback(
    (json: ChallengeEmailOtpBody) => {
      api
        .post("v1/client/challenge/email-magic-link", { json })
        .json<ChallengeEmailMagicLinkResponse>();
    },
    [api]
  );

  const verifyEmailMagicLink =
    useCallback(async (): Promise<VerifyEmailMagicLinkFinalizeResponse> => {
      return api
        .post(`v1/client/verify/email-magic-link/finalize`)
        .json<VerifyEmailMagicLinkFinalizeResponse>();
    }, [api]);

  //get the magic link authenticator
  useEffect(() => {
    const fetchAuthenticator = async () => {
      const getAuthenticator = async () => {
        const authenticators = await api
          .get("v1/client/user-authenticators")
          .json<Authenticator[]>();

        return authenticators.find(
          (
            authenticator: Authenticator
          ): authenticator is EmailMagicLinkAuthenticator => {
            return (
              authenticator.verificationMethod ===
              VerificationMethod.EMAIL_MAGIC_LINK
            );
          }
        );
      };

      const auth = await getAuthenticator();
      setAuthenticator(auth || null);
    };

    fetchAuthenticator();
  }, [api]);

  //send email magic link on page load, once we have the authenticator
  useEffect(() => {
    if (authenticator) {
      console.log("authenticator - sending", authenticator);
      sendEmailMagicLink({
        userAuthenticatorId: authenticator.userAuthenticatorId,
      });
    }
  }, [authenticator, sendEmailMagicLink]);

  const resendLink = () => {
    if (authenticator) {
      sendEmailMagicLink({
        userAuthenticatorId: authenticator.userAuthenticatorId,
      });

      toast.custom((activeToast) => (
        <SuccessToast activeToast={activeToast}>link-re-sent</SuccessToast>
      ));
    }
  };

  //Check if the email magic link has been verified
  //if it has, sign in the user using Congito
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchVerification = async () => {
      const response = await verifyEmailMagicLink();
      if (response.isVerified) {
        setIsVerified(true);
        cognitoSignIn(response.accessToken);
        clearInterval(intervalId);
      }
    };

    fetchVerification();

    if (!isVerified) {
      intervalId = setInterval(fetchVerification, 1000);
    }

    return () => clearInterval(intervalId);
  }, [api, isVerified, cognitoSignIn, verifyEmailMagicLink]);

  if (isCognitoSignInLoading) {
    return (
      <Main>
        <Paragraph>Getting Cognito token</Paragraph>
      </Main>
    );
  }

  return (
    <>
      <Toaster />
      {/* <ChallengeFlowHeader /> */}
      <Main>
        <H1>Email Magic Link</H1>
        <Paragraph>
          Check your email:
          <br />
          {authenticator?.email ? (
            <strong>{authenticator.email}</strong>
          ) : (
            <SkeletonText>place@holder.com</SkeletonText>
          )}
        </Paragraph>
        <Paragraph>It could take a minute for the email to arrive</Paragraph>
        <Paragraph>refresh-close-warning</Paragraph>
        <a onClick={resendLink}>re-send-link</a>
        <hr className="w-full border-divider" />
        {/* <FooterLinks
          fromUrl="/challenge/email-magic-link"
          verificationMethod={VerificationMethod.EMAIL_MAGIC_LINK}
        /> */}
      </Main>
    </>
  );
}
