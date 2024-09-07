import { useAtom } from "jotai";
import ky from "ky";
import { useMemo } from "react";

import { getPrefixUrlForRegion } from "@/helpers/api";
import { getAccessToken } from "@/store/session";
import { Region, regionAtom } from "@/store/session-config";

export function useSignalApi() {
  const [region] = useAtom(regionAtom);

  const prefixUrl = getPrefixUrlForRegion(region);

  const api = useMemo(
    () =>
      ky.create({
        prefixUrl,
        hooks: {
          beforeRequest: [
            (request: Request) => {
              const accessToken = getAccessToken();

              if (accessToken) {
                request.headers.set("Authorization", `Bearer ${accessToken}`);
              }
            },
          ],
        },
      }),
    [prefixUrl]
  );

  return { api };
}

type CreateSignalApiParams = {
  region?: Region;
  accessToken?: string;
};

export const createSignalApi = ({
  region,
  accessToken,
}: CreateSignalApiParams) => {
  const prefixUrl = getPrefixUrlForRegion(region);

  const kyOptions = {
    prefixUrl,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
  };

  return ky.create(kyOptions);
};
