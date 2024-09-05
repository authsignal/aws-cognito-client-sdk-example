import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useSignalApi } from "@/lib/signal-api";

export type Tenant = {
  name?: string;
  allowDisablingMfa?: boolean;
  disableRecoveryCodes?: boolean;
  hideSuccessScreenOnEnrollment?: boolean;
  allowTerminals?: boolean;
  thirdPartyScripts?: {
    googleTagManagerId?: string;
  };
  hideUiNavigationButtonsOnFirstPage?: boolean;
  customDomain?: string;
};

export const TENANT_QUERY_KEY = "tenant";

export function useTenant(
  options?: UseQueryOptions<Tenant, unknown, Tenant, ["tenant"]>
) {
  const { api } = useSignalApi();

  return useQuery({
    queryKey: [TENANT_QUERY_KEY],
    queryFn: () => api.get("v1/client/tenant").json<Tenant>(),
    staleTime: Infinity,
    ...options,
  });
}
