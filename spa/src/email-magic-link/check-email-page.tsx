"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { HTTPError } from "ky";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";

import {
  RECOVERY_CODES_QUERY_KEY,
  useAddEmailMagicLinkAuthenticator,
  useAppendEvent,
  UserActionVerificationEventType,
  useVerifyEmailMagicLinkFinalize,
} from "@/api";
import { VerificationMethod } from "@/api/types";
import { useUser } from "@/api/user/get-user";
import { Main } from "@/components/layouts";
import { EnrollmentFlowHeader } from "@/components/layouts/enrollment-flow-header";
import { LinkButton } from "@/components/shared/link";
import { ErrorToast, SuccessToast, Toaster } from "@/components/shared/toast";
import { H1, Paragraph } from "@/components/shared/typography";
import { useCustomRouter } from "@/hooks/use-custom-router";
import { useEnrollSuccessRouter } from "@/hooks/use-enroll-success-router";
import { useHasComeFromSettings } from "@/hooks/use-has-come-from-settings";
import { useRedirectToPasskeysUplift as useRedirectToPasskeysUplift } from "@/hooks/use-redirect-to-passkeys-uplift";

import { emailAtom } from "../../stores/email-magic-link";
import { setEnrolledAuthenticator } from "../../stores/enrollment";

export function CheckEmailPage() {
  const t = useTranslations("enroll.email-magic-link.check-email");
  const router = useCustomRouter();
  const { push } = useEnrollSuccessRouter();
  const queryClient = useQueryClient();

  const { appendEvent } = useAppendEvent();

  const user = useUser();
  const email = useAtomValue(emailAtom);

  const { mutate: addEmailMagicLinkAuthenticator, isLoading } =
    useAddEmailMagicLinkAuthenticator();

  const { data } = useVerifyEmailMagicLinkFinalize();
  const { shouldRedirectToPasskeysUplift } = useRedirectToPasskeysUplift();

  const hasComeFromSettings = useHasComeFromSettings();

  useEffect(() => {
    if (data?.isVerified) {
      appendEvent({
        type: UserActionVerificationEventType.VERIFICATION_METHOD_ADD,
        data: { verificationMethod: VerificationMethod.EMAIL_MAGIC_LINK },
      });

      if (data?.recoveryCodes) {
        queryClient.setQueryData(
          [RECOVERY_CODES_QUERY_KEY],
          data.recoveryCodes
        );
      }

      setEnrolledAuthenticator(VerificationMethod.EMAIL_MAGIC_LINK);

      if (shouldRedirectToPasskeysUplift().shouldRedirect) {
        router.push("/enable-passkeys");
      } else if (data?.recoveryCodes) {
        router.push("/enroll/recovery-codes");
      } else {
        push();
      }
    }
  }, [
    data,
    router,
    queryClient,
    appendEvent,
    shouldRedirectToPasskeysUplift,
    push,
  ]);

  const onAddEmailMagicLinkAuthenticatorError = useCallback(
    async (error: unknown) => {
      if (error instanceof HTTPError) {
        const body = await error.response.json();

        if ("error" in body && body.error === "too_many_requests") {
          toast.custom(
            (activeToast) => (
              <ErrorToast activeToast={activeToast}>
                {t("email-limit-exceeded")}
              </ErrorToast>
            ),
            {
              duration: 10000,
              id: "email-limit-exceeded",
            }
          );
        }
      }
    },
    [t]
  );

  useEffect(() => {
    addEmailMagicLinkAuthenticator(
      { email },
      { onError: onAddEmailMagicLinkAuthenticatorError }
    );
  }, [
    addEmailMagicLinkAuthenticator,
    email,
    onAddEmailMagicLinkAuthenticatorError,
  ]);

  const isMissingRequiredEnrolmentData = !email && !user?.email;

  if (isMissingRequiredEnrolmentData) {
    router.push("/enroll/email-magic-link");

    return null;
  }

  const resendLink = () => {
    if (!isLoading) {
      addEmailMagicLinkAuthenticator(
        { email },
        {
          onSuccess: () => {
            toast.custom((activeToast) => (
              <SuccessToast activeToast={activeToast}>
                {t("link-re-sent")}
              </SuccessToast>
            ));
          },
          onError: onAddEmailMagicLinkAuthenticatorError,
        }
      );
    }
  };

  return (
    <>
      <Toaster />
      <EnrollmentFlowHeader
        isFirstStepInEnrollmentFlow={Boolean(
          !hasComeFromSettings && user?.email
        )}
      />
      <Main>
        <H1>{t("heading")}</H1>
        <Paragraph>
          {t("description")}
          <br />
          <strong>{email || user?.email}</strong>
        </Paragraph>
        <Paragraph>{t("prompt")}</Paragraph>
        <Paragraph>
          {t.rich("refresh-close-warning", { br: () => <br /> })}
        </Paragraph>
        <a onClick={resendLink}>{t("re-send-link")}</a>
      </Main>
    </>
  );
}
