"use client";

import { JwtPayload } from "jwt-decode";

import { Region } from "@/store";

export type AuthsignalToken = JwtPayload & {
  scope: string;
  other: {
    name: string;
    actionCode: string;
    idempotencyKey?: string;
    publishableKey?: string;
    tenantId: string;
    userId: string;
    region: Region;
    /** A string of verification methods separated with spaces w `email_magic_link authenticator_app security_key sms` */
    verificationMethods?: string;
    requiredVerificationMethods?: string;
    redirectOnSessionExpiry?: boolean;
    promptToEnrollVerificationMethods?: string;
    challengeId?: string;
  };
};
