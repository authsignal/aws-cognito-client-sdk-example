let accessToken: string | undefined;

export function setAccessToken(value: string) {
  accessToken = value;
}

export function getAccessToken(): string | undefined {
  return accessToken;
}

let sessionExpiry: Date;

export function setSessionExpiry(value: Date) {
  sessionExpiry = value;
}

export function getSessionExpiry(): Date {
  return sessionExpiry;
}
