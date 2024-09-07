import { useEffect } from "react";
import toast from "react-hot-toast";

import {
  useChallengeEmailMagicLink,
  useEmailMagicLinkAuthenticator,
  useVerifyEmailMagicLinkFinalize,
} from "@/api";

import { Main } from "@/components/layouts";
import { SkeletonText } from "@/components/shared/skeleton-page";
import { SuccessToast, Toaster } from "@/components/shared/toast";
import { H1, Paragraph } from "@/components/shared/typography";

export function EmailMagicLinkChallengePage() {
  const { data: authenticator } = useEmailMagicLinkAuthenticator();
  const { mutate: challenge, isLoading } = useChallengeEmailMagicLink();
  const { isCognitoSignInLoading } = useVerifyEmailMagicLinkFinalize();

  useEffect(() => {
    if (authenticator) {
      challenge({ userAuthenticatorId: authenticator.userAuthenticatorId });
    }
  }, [authenticator, challenge]);

  const resendLink = () => {
    if (!isLoading && authenticator) {
      challenge({ userAuthenticatorId: authenticator.userAuthenticatorId });

      toast.custom((activeToast) => (
        <SuccessToast activeToast={activeToast}>link-re-sent</SuccessToast>
      ));
    }
  };

  if (isCognitoSignInLoading) {
    return (
      <Main>
        <Paragraph>Getting Cognito token</Paragraph>
      </Main>
    );
  }

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
