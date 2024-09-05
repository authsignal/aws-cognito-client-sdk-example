import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { VerificationMethod } from "../types";

export const USER_QUERY_KEY = "user";

export type User = {
  email: string | undefined;
  phoneNumber: string | undefined;
  hasRecoveryCodes: boolean;
  defaultVerificationMethod?: VerificationMethod;
};

export function useUser() {
  const { data: user } = useQuery<User>([USER_QUERY_KEY], { enabled: false });
  return user;
}

export function useDefaultVerificationMethod() {
  const user = useUser();

  const defaultVerificationMethod = user?.defaultVerificationMethod;

  const isDefaultVerificationMethod = useCallback(
    (verificationMethod: VerificationMethod) => {
      if (!defaultVerificationMethod) {
        return true;
      }
      return verificationMethod === defaultVerificationMethod;
    },
    [defaultVerificationMethod]
  );

  const config = useMemo(
    () => ({ defaultVerificationMethod, isDefaultVerificationMethod }),
    [defaultVerificationMethod, isDefaultVerificationMethod]
  );

  return config;
}
