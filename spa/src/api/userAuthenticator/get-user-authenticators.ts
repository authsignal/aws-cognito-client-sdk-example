import { useQuery } from "@tanstack/react-query";

import {
  isSmsAuthenticator,
  isAuthenticatorAppAuthenticator,
  isEmailMagicLinkAuthenticator,
  isSecurityKeyAuthenticator,
  isPushAuthenticator,
  isIProovAuthenticator,
  isPasskeyAuthenticator,
  isEmailOtpAuthenticator,
} from "@/helpers/user-authenticator";

import { useSignalApi } from "@/lib/signal-api";

import { Authenticator } from "./types";

const PATH = "v1/client/user-authenticators";

export const USER_AUTHENTICATORS_QUERY_KEY = "userAuthenticators";

function useHasBackupAuthenticator() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    select: (authenticators) => authenticators.length > 1,
    staleTime: Infinity,
  });
}

function useSmsAuthenticator() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    select: (authenticators) => authenticators.find(isSmsAuthenticator),
    staleTime: Infinity,
  });
}

function useAuthenticatorAppAuthenticator() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    select: (authenticators) =>
      authenticators.find(isAuthenticatorAppAuthenticator),
    staleTime: Infinity,
  });
}

function useEmailMagicLinkAuthenticator() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    select: (authenticators) =>
      authenticators.find(isEmailMagicLinkAuthenticator),
    staleTime: Infinity,
  });
}

function useEmailOtpAuthenticator() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    select: (authenticators) => authenticators.find(isEmailOtpAuthenticator),
    staleTime: Infinity,
  });
}

function useSecurityKeyAuthenticator() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    select: (authenticators) => authenticators.find(isSecurityKeyAuthenticator),
    staleTime: Infinity,
  });
}

function usePasskeyAuthenticators() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    select: (authenticators) => authenticators.filter(isPasskeyAuthenticator),
    staleTime: Infinity,
  });
}

function usePushAuthenticators() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    select: (authenticators) => authenticators.filter(isPushAuthenticator),
    staleTime: Infinity,
  });
}

function useGetIProovAuthenticator() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    select: (authenticators) => authenticators.find(isIProovAuthenticator),
    staleTime: Infinity,
  });
}

function useGetUserAuthenticators() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [USER_AUTHENTICATORS_QUERY_KEY],
    queryFn: () => api.get(PATH).json<Authenticator[]>(),
    staleTime: Infinity,
  });
}

export {
  useGetUserAuthenticators,
  useSmsAuthenticator,
  useAuthenticatorAppAuthenticator,
  useEmailMagicLinkAuthenticator,
  useEmailOtpAuthenticator,
  useSecurityKeyAuthenticator,
  usePushAuthenticators,
  useGetIProovAuthenticator,
  useHasBackupAuthenticator,
  usePasskeyAuthenticators,
};
