import { ChallengeNameType } from "@aws-sdk/client-cognito-identity-provider";
import {
  RespondToAuthChallengeCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});

const cognitoClientId = import.meta.env.VITE_COGNITO_CLIENT_ID!;

export function useCognitoSignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const cognitoSignIn = async (token: string) => {
    setIsLoading(true);
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
    setIsLoading(false);
    navigate("/");
  };

  return {
    cognitoSignIn,
    isLoading,
  };
}
