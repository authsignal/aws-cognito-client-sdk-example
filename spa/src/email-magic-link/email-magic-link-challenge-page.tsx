import { useCallback, useEffect, useState } from "react";
import {
  RespondToAuthChallengeCommand,
  CognitoIdentityProviderClient,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";
import { useClientApi } from "../lib/client-api";
import { useNavigate } from "react-router-dom";

type EmailMagicLinkAuthenticator = {
  userAuthenticatorId: string;
  createdAt: string;
  isDefault: boolean;
  authenticatorType: "OOB";
  oobChannel: "EMAIL_MAGIC_LINK";
  verificationMethod: "EMAIL_MAGIC_LINK";
  email: string;
};

type ChallengeEmailOtpBody = { userAuthenticatorId: string };

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
  const { api } = useClientApi({ initialToken });

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
    async (json: ChallengeEmailOtpBody) => {
      const response = await api.fetch("/client/challenge/email-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      return response.json();
    },
    [api]
  );

  const verifyEmailMagicLink =
    useCallback(async (): Promise<VerifyEmailMagicLinkFinalizeResponse> => {
      const response = await api.fetch(
        "/client/verify/email-magic-link/finalize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.json();
    }, [api]);

  useEffect(() => {
    const fetchAuthenticatorAndSendEmail = async () => {
      const response = await api.fetch("/client/user-authenticators", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const authenticators = await response.json();
      const auth = authenticators.find(
        (
          authenticator: EmailMagicLinkAuthenticator
        ): authenticator is EmailMagicLinkAuthenticator =>
          authenticator.verificationMethod === "EMAIL_MAGIC_LINK"
      );
      setAuthenticator(auth || null);

      if (auth) {
        await sendEmailMagicLink({
          userAuthenticatorId: auth.userAuthenticatorId,
        });
      }
    };

    fetchAuthenticatorAndSendEmail();
  }, [api, sendEmailMagicLink]);

  const resendLink = useCallback(() => {
    if (authenticator) {
      sendEmailMagicLink({
        userAuthenticatorId: authenticator.userAuthenticatorId,
      });
    }
  }, [authenticator, sendEmailMagicLink]);

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
  }, [isVerified, cognitoSignIn, verifyEmailMagicLink]);

  if (isCognitoSignInLoading) {
    return (
      <main className="custom-content-alignment flex flex-col gap-y-4">
        <p>Getting Cognito token</p>
      </main>
    );
  }

  return (
    <main className="custom-content-alignment flex flex-col gap-y-4">
      <h1>Email Magic Link</h1>
      <p>
        Check your email:
        <br />
        {authenticator?.email ? (
          <strong>{authenticator.email}</strong>
        ) : (
          "place@holder.com"
        )}
      </p>
      <p>It could take a minute for the email to arrive</p>
      <p>refresh-close-warning</p>
      <a onClick={resendLink}>re-send-link</a>
      <hr className="w-full border-divider" />
    </main>
  );
}
