import ky from "ky";
import { useMemo } from "react";

export function getPrefixUrlForRegion(region?: string) {
  switch (region) {
    case "au":
      return "https://au.api.authsignal.com/v1";
    case "eu":
      return "https://eu.api.authsignal.com/v1";
    case "us":
      return "https://api.authsignal.com";
    default: {
      return "https://api.authsignal.com";
    }
  }
}

const region = "us";

export function useSignalApi({ initialToken }: { initialToken: string }) {
  const prefixUrl = getPrefixUrlForRegion(region);

  const api = useMemo(
    () =>
      ky.create({
        prefixUrl,
        hooks: {
          beforeRequest: [
            (request: Request) => {
              if (initialToken) {
                request.headers.set("Authorization", `Bearer ${initialToken}`);
              }
            },
          ],
        },
      }),
    [initialToken, prefixUrl]
  );

  return { api };
}
