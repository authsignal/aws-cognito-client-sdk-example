import {useAtom} from "jotai";
import ky from "ky";
import {useMemo} from "react";

import {getTerminalPrefixUrlForRegion} from "@/helpers/api";
import {getAccessToken} from "@/store/session";
import {Region, regionAtom} from "@/store/session-config";

export function useTerminalApi() {
  const [region] = useAtom(regionAtom);

  const prefixUrl = getTerminalPrefixUrlForRegion(region);

  const api = useMemo(
    () =>
      ky.create({
        prefixUrl,
        hooks: {
          beforeRequest: [
            (request) => {
              const accessToken = getAccessToken();

              if (accessToken) {
                request.headers.set("Authorization", `Bearer ${accessToken}`);
              }
            },
          ],
        },
      }),
    [prefixUrl],
  );

  return {api};
}

type CreateTerminalApiParams = {
  region?: Region;
  accessToken?: string;
};

export const createTerminalApi = ({region, accessToken}: CreateTerminalApiParams) => {
  const prefixUrl = getTerminalPrefixUrlForRegion(region);

  const kyOptions = {
    prefixUrl,
    headers: accessToken ? {Authorization: `Bearer ${accessToken}`} : undefined,
  };

  return ky.create(kyOptions);
};
