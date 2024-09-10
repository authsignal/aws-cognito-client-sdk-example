import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authsignal } from "./authsignal";

const clearData = async () => {
  localStorage.setItem("username", "");
  localStorage.setItem("session", "");
  localStorage.setItem("token", "");
  localStorage.setItem("refreshToken", "");
  localStorage.setItem("accessToken", "");
};

export function Home() {
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/sign-in");
    }
  }, [navigate]);

  async function promptToCreatePasskey() {
    // The Authsignal SDK requires an authenticated user token to create a passkey
    // To keep the demo simple, we use the token returned from the successful pre-built UI login attempt
    // This token is only valid for 10 mins - you can also generate a new one from your backend
    // https://docs.authsignal.com/scenarios/passkeys-client-sdk#creating-a-passkey
    const token = localStorage.getItem("authsignal_token");

    localStorage.removeItem("authsignal_token");

    // True if a passkey has already been created on this device using the Web SDK
    const isPasskeyAvailable = await authsignal.passkey.isAvailableOnDevice();

    if (token && !isPasskeyAvailable) {
      const result = await authsignal.passkey.signUp({ token });

      if (result) {
        alert("Passkey created!");
      }
    }
  }

  useEffect(() => {
    promptToCreatePasskey();
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setAccessToken(accessToken);
    }

    const username = localStorage.getItem("username");
    if (username) {
      setUsername(username);
    }
  }, []);

  if (!username) {
    return null;
  }

  return (
    <main>
      <section>
        <h1>Example SPA with Cognito integration via client-side calls</h1>
        <div>Cognito username: {username}</div>
        <div>Cognito accessToken: {accessToken}</div>
        <button
          onClick={() => {
            clearData();
            navigate("/sign-in");
          }}
        >
          Sign out
        </button>
      </section>
    </main>
  );
}
