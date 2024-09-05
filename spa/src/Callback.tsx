import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RespondToAuthChallengeCommand,
  CognitoIdentityProviderClient,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});
const cognitoClientId = import.meta.env.VITE_COGNITO_CLIENT_ID!;

const respondToCallback = async (navigate: ReturnType<typeof useNavigate>) => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const session = localStorage.getItem("session");
  const username = localStorage.getItem("username");

  if (!token || !session || !username) {
    navigate("/");
    return;
  }

  try {
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

    navigate("/");
  } catch (err) {
    // do nothing
  }
};

export function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    respondToCallback(navigate);
  }, [navigate]);

  return (
    <div>
      <h1>LOADING!!!!!</h1>
    </div>
  );
}
