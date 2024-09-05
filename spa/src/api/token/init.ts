import { useQuery, useQueryClient } from "@tanstack/react-query";
import { JwtPayload, jwtDecode } from "jwt-decode";

import { AuthsignalToken } from "@/auth";
import { createSignalApi } from "@/lib/signal-api";
import { setAccessToken, setSessionExpiry } from "@/store/session";

import {
  TENANT_AUTHENTICATORS_QUERY_KEY,
  TENANT_QUERY_KEY,
  Tenant,
  USER_AUTHENTICATORS_QUERY_KEY,
} from "..";
import {
  ACTION_CONFIGURATION_QUERY_KEY,
  ActionConfiguration,
} from "../actionConfiguration/get-action-configuration";
import { TenantAuthenticator } from "../tenant/types";
import { USER_QUERY_KEY, User } from "../user/get-user";
import { Authenticator } from "../userAuthenticator/types";
import { useLocation } from "react-router-dom";

export type InitResponse = {
  token: string;
  userAuthenticators: Authenticator[];
  authenticatorConfigurations: TenantAuthenticator[];
  tenantConfiguration: Tenant;
  user: User;
  actionConfiguration: ActionConfiguration;
};

const INIT_QUERY_KEY = "init";
// const DEFAULT_SESSION_EXPIRY_MINS = 10;

type Props = {
  initialToken: string;
};

export function useInit({ initialToken }: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const queryClient = useQueryClient();

  const state = searchParams?.get("state") as string | undefined;

  const redirectUrl = searchParams?.get("redirectUrl") as string | undefined;

  const region = initialToken
    ? jwtDecode<AuthsignalToken>(initialToken).other.region
    : undefined;

  const { data } = useQuery({
    queryKey: [INIT_QUERY_KEY],
    queryFn: async () => {
      console.log("region", region);
      const api = createSignalApi({ region });

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${initialToken}`,
      };

      console.log("headers", headers);

      const {
        token,
        tenantConfiguration,
        userAuthenticators,
        authenticatorConfigurations,
        user,
        actionConfiguration,
      } = await api
        .post("v1/client/init", {
          headers,
          json: { state, redirectUrl },
        })
        .json<InitResponse>();

      console.log("headers", headers);

      setAccessToken(token);

      const { exp } = jwtDecode<JwtPayload>(token);

      if (exp) {
        setSessionExpiry(new Date(exp * 1000));
      }

      queryClient.setQueryData([USER_QUERY_KEY], user);
      queryClient.setQueryData([TENANT_QUERY_KEY], tenantConfiguration);
      queryClient.setQueryData(
        [TENANT_AUTHENTICATORS_QUERY_KEY],
        authenticatorConfigurations
      );
      queryClient.setQueryData(
        [USER_AUTHENTICATORS_QUERY_KEY],
        userAuthenticators
      );
      queryClient.setQueryData(
        [ACTION_CONFIGURATION_QUERY_KEY],
        actionConfiguration
      );

      return {
        token,
      };
    },
    retry: false,
    staleTime: Infinity,
    enabled: !!initialToken,
  });

  if (!data && !initialToken) {
    return { token: undefined };
  }

  return { token: data?.token };
}
