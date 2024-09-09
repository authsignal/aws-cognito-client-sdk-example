import ky from "ky";
import { useMemo } from "react";

export function useSignalApi({ initialToken }: { initialToken: string }) {
  const prefixUrl = "https://api.authsignal.com/v1";

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
