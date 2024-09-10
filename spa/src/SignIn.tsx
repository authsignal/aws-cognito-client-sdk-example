import { useEffect, useState, useCallback } from "react";
import {
  AuthFlowType,
  InitiateAuthCommand,
  SignUpCommand,
  CognitoIdentityProviderClient,
  RespondToAuthChallengeCommand,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";
import { EmailMagicLinkChallengePage } from "./email-magic-link/email-magic-link-challenge-page";
import { useNavigate } from "react-router-dom";
import { authsignal } from "./authsignal";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});
const cognitoClientId = import.meta.env.VITE_COGNITO_CLIENT_ID!;

type PasskeySignInResponse = {
  token?: string;
  userName?: string;
};

type HandlePasskeySignInInput = {
  cognitoSignIn: (token: string) => void;
  response?: PasskeySignInResponse;
};

async function handlePasskeySignIn({
  cognitoSignIn,
  response,
}: HandlePasskeySignInInput) {
  if (!response?.token || !response?.userName) {
    return;
  }

  const signInResponse = await signIn(response.userName);

  if (signInResponse.Session) {
    localStorage.setItem("session", signInResponse.Session);
    localStorage.setItem("username", response?.userName);
  }

  cognitoSignIn(response.token);
}

async function signIn(username: string) {
  const initiateAuthInput = {
    ClientId: cognitoClientId,
    AuthFlow: AuthFlowType.CUSTOM_AUTH,
    AuthParameters: {
      USERNAME: username,
    },
  };

  const initiateAuthCommand = new InitiateAuthCommand(initiateAuthInput);

  return await cognitoClient.send(initiateAuthCommand);
}

async function signUp(username: string) {
  const randomByteArray = new Uint8Array(32);
  self.crypto.getRandomValues(randomByteArray);
  const asciiString = randomByteArray.reduce(
    (acc, val) => acc + String.fromCharCode(val),
    ""
  );
  const password = window.btoa(asciiString);

  const signUpInput = {
    ClientId: cognitoClientId,
    Username: username,
    Password: password,
  };

  const signUpCommand = new SignUpCommand(signUpInput);

  return await cognitoClient.send(signUpCommand);
}

async function handleSignInClick(username: string) {
  clearData();

  const signInResponse = await signIn(username).catch(async () => {
    await signUp(username);
    return await signIn(username);
  });

  if (signInResponse.Session) {
    localStorage.setItem("session", signInResponse.Session);
    localStorage.setItem("username", username);
  }

  const authsignalToken = signInResponse.ChallengeParameters?.token;

  return authsignalToken;
}

function clearData() {
  localStorage.setItem("username", "");
  localStorage.setItem("session", "");
  localStorage.setItem("token", "");
  localStorage.setItem("refreshToken", "");
  localStorage.setItem("accessToken", "");
}

export function SignIn() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCognitoSignInLoading, setIsCognitoSignInLoading] = useState(false);

  const navigate = useNavigate();

  const [initialToken, setInitialToken] = useState<null | string>(null);

  useEffect(() => {
    authsignal.passkey
      .signIn({ action: "cognitoAuth", autofill: true, onVerificationStarted })
      .then((response) => handlePasskeySignIn({ response, cognitoSignIn }))
      .finally(() => setLoading(false));
  }, []);

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

  if (initialToken) {
    return (
      <EmailMagicLinkChallengePage
        isCognitoSignInLoading={isCognitoSignInLoading}
        cognitoSignIn={cognitoSignIn}
        initialToken={initialToken}
      />
    );
  }

  const onVerificationStarted = () => setLoading(true);

  return (
    <main>
      <section>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="webauthn"
          name="email"
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <button
          onClick={async () => {
            setLoading(true);

            const token = await handleSignInClick(username);

            setInitialToken(token || null);

            setLoading(false);
          }}
        >
          {loading ? "Loading" : "Sign in"}
        </button>
      </section>
    </main>
  );
}
