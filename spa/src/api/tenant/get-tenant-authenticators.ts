import { useQuery } from "@tanstack/react-query";

import { useSignalApi } from "@/lib/signal-api";

import { VerificationMethod } from "../types";

import {
  AuthenticatorAppTenantAuthenticator,
  IProovTenantAuthenticator,
  SmsTenantAuthenticator,
  TenantAuthenticator,
} from "./types";

export const TENANT_AUTHENTICATORS_QUERY_KEY = "tenantAuthenticators";

function useTenantAuthenticators() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [TENANT_AUTHENTICATORS_QUERY_KEY],
    queryFn: () =>
      api.get("v1/client/authenticators").json<TenantAuthenticator[]>(),
    staleTime: Infinity,
    select: (tenantAuthenticators) =>
      tenantAuthenticators.filter((a) => a.isActive),
  });
}

export function useEditableTenantAuthenticators() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [TENANT_AUTHENTICATORS_QUERY_KEY],
    queryFn: () =>
      api.get("v1/client/authenticators").json<TenantAuthenticator[]>(),
    staleTime: Infinity,
    select: (tenantAuthenticators) =>
      tenantAuthenticators.filter((a) => a.isActive && a.isEditableByUser),
  });
}

export function useAuthenticatorAppAuthenticatorConfig() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [TENANT_AUTHENTICATORS_QUERY_KEY],
    queryFn: () =>
      api.get("v1/client/authenticators").json<TenantAuthenticator[]>(),
    staleTime: Infinity,
    select: (tenantAuthenticators) =>
      tenantAuthenticators.find(isAuthenticatorAppAuthenticator),
  });
}

function isAuthenticatorAppAuthenticator(
  authenticator: TenantAuthenticator
): authenticator is AuthenticatorAppTenantAuthenticator {
  return (
    authenticator.verificationMethod === VerificationMethod.AUTHENTICATOR_APP
  );
}

export function useIProovConfig() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [TENANT_AUTHENTICATORS_QUERY_KEY],
    queryFn: () =>
      api.get("v1/client/authenticators").json<TenantAuthenticator[]>(),
    staleTime: Infinity,
    select: (tenantAuthenticators) =>
      tenantAuthenticators.find(isIProovAuthenticator),
  });
}

function isIProovAuthenticator(
  authenticator: TenantAuthenticator
): authenticator is IProovTenantAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.IPROOV;
}

export function useSmsTenantAuthenticatorConfig() {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [TENANT_AUTHENTICATORS_QUERY_KEY],
    queryFn: () =>
      api.get("v1/client/authenticators").json<TenantAuthenticator[]>(),
    staleTime: Infinity,
    select: (tenantAuthenticators) =>
      tenantAuthenticators.find(isSmsAuthenticator),
  });
}

function isSmsAuthenticator(
  authenticator: TenantAuthenticator
): authenticator is SmsTenantAuthenticator {
  return authenticator.verificationMethod === VerificationMethod.SMS;
}

function useTenantAuthenticatorConfig() {
  const { data, isLoading } = useTenantAuthenticators();

  const smsConfig = data?.find(
    (a) => a.verificationMethod === VerificationMethod.SMS
  );
  const authenticatorAppConfig = data?.find(
    (a) => a.verificationMethod === VerificationMethod.AUTHENTICATOR_APP
  );
  const emailMagicLinkConfig = data?.find(
    (a) => a.verificationMethod === VerificationMethod.EMAIL_MAGIC_LINK
  );
  const emailOtpConfig = data?.find(
    (a) => a.verificationMethod === VerificationMethod.EMAIL_OTP
  );
  const securityKeyConfig = data?.find(
    (a) => a.verificationMethod === VerificationMethod.SECURITY_KEY
  );
  const pushConfig = data?.find(
    (a) => a.verificationMethod === VerificationMethod.PUSH
  );
  const passkeyConfig = data?.find(
    (a) => a.verificationMethod === VerificationMethod.PASSKEY
  );
  const veriffConfig = data?.find(
    (a) => a.verificationMethod === VerificationMethod.VERIFF
  );
  const iproovConfig = data?.find(
    (a) => a.verificationMethod === VerificationMethod.IPROOV
  );

  return {
    isLoading,
    [VerificationMethod.SMS]: {
      isEditable: smsConfig?.isEditableByUser,
      isHidden: smsConfig?.isHiddenToUser,
    },
    [VerificationMethod.AUTHENTICATOR_APP]: {
      isEditable: authenticatorAppConfig?.isEditableByUser,
      isHidden: authenticatorAppConfig?.isHiddenToUser,
    },
    [VerificationMethod.EMAIL_MAGIC_LINK]: {
      isEditable: emailMagicLinkConfig?.isEditableByUser,
      isHidden: emailMagicLinkConfig?.isHiddenToUser,
    },
    [VerificationMethod.EMAIL_OTP]: {
      isEditable: emailOtpConfig?.isEditableByUser,
      isHidden: emailOtpConfig?.isHiddenToUser,
    },
    [VerificationMethod.SECURITY_KEY]: {
      isEditable: securityKeyConfig?.isEditableByUser,
      isHidden: securityKeyConfig?.isHiddenToUser,
    },
    [VerificationMethod.PUSH]: {
      isEditable: pushConfig?.isEditableByUser,
      isHidden: pushConfig?.isHiddenToUser,
    },
    [VerificationMethod.PASSKEY]: {
      isEditable: passkeyConfig?.isEditableByUser,
      isHidden: passkeyConfig?.isHiddenToUser,
    },
    [VerificationMethod.VERIFF]: {
      isEditable: veriffConfig?.isEditableByUser,
      isHidden: veriffConfig?.isHiddenToUser,
    },
    [VerificationMethod.IPROOV]: {
      isEditable: iproovConfig?.isEditableByUser,
      isHidden: iproovConfig?.isHiddenToUser,
    },
  };
}

export { useTenantAuthenticators, useTenantAuthenticatorConfig };
