"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

import {
  useChallengeEmailMagicLink,
  useEmailMagicLinkAuthenticator,
  useVerifyEmailMagicLinkFinalize,
} from "@/api";

import { VerificationMethod } from "@/api/types";
import { Main } from "@/components/layouts";
import { SkeletonText } from "@/components/shared/skeleton-page";
import { SuccessToast, Toaster } from "@/components/shared/toast";
import { H1, Paragraph } from "@/components/shared/typography";

// import { ChallengeFlowHeader } from "../components/challenge-flow-header";

import { useOnVerificationSuccess } from "../hooks";

export function EmailMagicLinkChallengePage() {
  const { data: authenticator } = useEmailMagicLinkAuthenticator();
  const { mutate: challenge, isLoading } = useChallengeEmailMagicLink();
  const { data: verifyMagicLinkFinalizeResponse } =
    useVerifyEmailMagicLinkFinalize();

  const onVerificationSuccess = useOnVerificationSuccess();

  useEffect(() => {
    if (authenticator) {
      challenge({ userAuthenticatorId: authenticator.userAuthenticatorId });
    }
  }, [authenticator, challenge]);

  useEffect(() => {
    if (verifyMagicLinkFinalizeResponse?.isVerified) {
      // onVerificationSuccess({
      //   verificationMethod: VerificationMethod.EMAIL_MAGIC_LINK,
      // });
    }
  }, [verifyMagicLinkFinalizeResponse, onVerificationSuccess]);

  const resendLink = () => {
    if (!isLoading && authenticator) {
      console.log("resend link");
      console.log({ authenticator });
      challenge({ userAuthenticatorId: authenticator.userAuthenticatorId });

      toast.custom((activeToast) => (
        <SuccessToast activeToast={activeToast}>link-re-sent</SuccessToast>
      ));
    }
  };

  return (
    <>
      <Toaster />
      {/* <ChallengeFlowHeader /> */}
      <Main>
        <H1>Email Magic Link</H1>
        <Paragraph>
          Check your email:
          <br />
          {authenticator?.email ? (
            <strong>{authenticator.email}</strong>
          ) : (
            <SkeletonText>place@holder.com</SkeletonText>
          )}
        </Paragraph>
        <Paragraph>It could take a minute for the email to arrive</Paragraph>
        <Paragraph>refresh-close-warning</Paragraph>
        <a onClick={resendLink}>re-send-link</a>
        <hr className="w-full border-divider" />
        {/* <FooterLinks
          fromUrl="/challenge/email-magic-link"
          verificationMethod={VerificationMethod.EMAIL_MAGIC_LINK}
        /> */}
      </Main>
    </>
  );
}
