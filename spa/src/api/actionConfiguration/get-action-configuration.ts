import { useQuery } from "@tanstack/react-query";

import { VerificationMethod } from "../types";

export type SupportedLanguage =
  | "en"
  | "fr"
  | "de"
  | "he"
  | "it"
  | "pl"
  | "pt-BR"
  | "es";

export interface PathStep {
  source: string;
  target: string;
  data: {
    sourceData: { verificationMethod?: VerificationMethod } & Record<
      string,
      unknown
    >;
    targetData: { verificationMethod?: VerificationMethod } & Record<
      string,
      unknown
    >;
  };
  type: {
    sourceType: "input" | (string & {});
    targetType: "output" | (string & {});
  };
}

export type Paths = PathStep[][];

export type ActionConfiguration = {
  messagingTemplates: Partial<
    Record<
      SupportedLanguage,
      {
        defaultTemplate: string;
      }
    >
  >;
  authFlow?: Paths;
  allowedVerificationMethods: VerificationMethod[];
  promptToEnrollVerificationMethods?: VerificationMethod[];
};

export const ACTION_CONFIGURATION_QUERY_KEY = "action-configuration";

export function useActionConfiguration() {
  return useQuery<ActionConfiguration>([ACTION_CONFIGURATION_QUERY_KEY], {
    enabled: false,
  });
}
