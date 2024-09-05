import { atom } from "jotai";
import { jwtDecode } from "jwt-decode";
import store from "store2";

import { VerificationMethod } from "@/api/types";
import { AuthsignalToken } from "@/auth";

import { getAccessToken } from "./session";

export type Region = "au" | "eu" | "us";

export const regionAtom = atom<Region | undefined>(undefined);

const FORCE_ENROLLMENT_KEY = "forceEnrollment";

const DEFAULT_FORCE_ENROLLMENT = false;

export function setForceEnrollment(setForceEnrollment: boolean) {
  store.session.set(FORCE_ENROLLMENT_KEY, setForceEnrollment);
}

/** A flag to indicate a user should be forced to complete
 * enrollment.
 */
export function getForceEnrollment(): boolean | undefined {
  return store.session.get(FORCE_ENROLLMENT_KEY) || DEFAULT_FORCE_ENROLLMENT;
}

export type Mode = "popup" | "redirect" | undefined;

const MODE_KEY = "mode";

const DEFAULT_MODE = "redirect" as const;

export function setMode(mode: Mode) {
  store.session.set(MODE_KEY, mode);
}

export function getMode(): Mode {
  return store.session.get(MODE_KEY) || DEFAULT_MODE;
}

const SETTINGS_KEY = "settings";

const DEFAULT_SETTINGS = false;

export function setSettings(settings: boolean) {
  store.session.set(SETTINGS_KEY, settings);
}

/** The behavior post challenge/enrollment.If `true` the user will
 * be taken to the settings screen
 */
export function getSettings(): boolean | undefined {
  return store.session.get(SETTINGS_KEY) || DEFAULT_SETTINGS;
}

const STATE_KEY = "state";

export function setState(state: string | null | undefined) {
  store.session.set(STATE_KEY, state ?? null);
}

export function getState(): string | undefined {
  return store.session.get(STATE_KEY);
}

export function removeState() {
  store.session.remove(STATE_KEY);
}

const REDIRECT_URL_KEY = "redirectUrl";

export function setRedirectUrl(redirectUrl: string | undefined) {
  store.session.set(REDIRECT_URL_KEY, redirectUrl ?? null);
}

export function getRedirectUrl(): string | undefined {
  return store.session.get(REDIRECT_URL_KEY);
}

let promptToEnrollVerificationMethods: VerificationMethod[];

export function setPromptToEnrollVerificationMethods(value?: string) {
  if (!value) {
    promptToEnrollVerificationMethods = [];

    return;
  }

  const parsedVerificationMethods = value
    .split(" ")
    .map((verificationMethod) =>
      verificationMethod.toUpperCase()
    ) as VerificationMethod[];

  promptToEnrollVerificationMethods = parsedVerificationMethods;
}

export function getPromptToEnrollVerificationMethods():
  | VerificationMethod[]
  | undefined {
  return promptToEnrollVerificationMethods;
}

let permittedVerificationMethods: VerificationMethod[];

export function setPermittedVerificationMethods(value?: string) {
  if (!value) {
    permittedVerificationMethods = [];

    return;
  }

  const parsedVerificationMethods = value
    .split(" ")
    .map((verificationMethod) =>
      verificationMethod.toUpperCase()
    ) as VerificationMethod[];

  permittedVerificationMethods = parsedVerificationMethods;
}

export function getPermittedVerificationMethods():
  | VerificationMethod[]
  | undefined {
  return permittedVerificationMethods;
}

export function getActionCode(): string {
  const token = getAccessToken();

  if (!token) {
    return "";
  }

  const { actionCode } = jwtDecode<AuthsignalToken>(token).other;

  return actionCode;
}
