import { useState } from "react";
import {
  AuthFlowType,
  InitiateAuthCommand,
  SignUpCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { Authenticate } from "./authenticate";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});
const cognitoClientId = import.meta.env.VITE_COGNITO_CLIENT_ID!;

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

  console.log({ signUpCommand, username, password, cognitoClientId });

  return await cognitoClient.send(signUpCommand);
}

async function handleSignInClick(username: string) {
  clearData();

  const signInResponse = await signIn(username).catch(async () => {
    console.log("calling sign up");
    await signUp(username);
    return await signIn(username);
  });

  if (signInResponse.Session) {
    localStorage.setItem("session", signInResponse.Session);
    localStorage.setItem("username", username);
  }

  console.log({ signInResponse });

  const token = signInResponse.ChallengeParameters?.token;

  return token;

  // if (signInResponse.ChallengeParameters?.url) {
  //   window.location.href = signInResponse.ChallengeParameters?.url;
  // }
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

  const [initialToken, setInitialToken] = useState<null | string>(null);

  if (initialToken) {
    return <Authenticate initialToken={initialToken}></Authenticate>;
  }

  return (
    <main>
      <section>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <button
          onClick={async () => {
            setLoading(true);

            const token = await handleSignInClick(username);

            console.log("Setting token");

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
