import { useMemo } from "react";

export function useClientApi({ initialToken }: { initialToken: string }) {
  const prefixUrl = "https://api.authsignal.com/v1";

  const api = useMemo(() => {
    const clientApi = async (endpoint: string, options: RequestInit = {}) => {
      const url = `${prefixUrl}${endpoint}`;
      const headers = new Headers(options.headers || {});
      if (initialToken) {
        headers.set("Authorization", `Bearer ${initialToken}`);
      }
      const response = await fetch(url, {
        ...options,
        headers,
      });
      return response;
    };

    return { fetch: clientApi };
  }, [initialToken, prefixUrl]);

  return { api };
}
