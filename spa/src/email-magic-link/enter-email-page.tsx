"use client";

import {useAtom} from "jotai";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {useForm} from "react-hook-form";

import {useTenantAuthenticatorConfig} from "@/api";
import {VerificationMethod} from "@/api/types";
import {Main} from "@/components/layouts";
import {EnrollmentFlowHeader} from "@/components/layouts/enrollment-flow-header";
import {AboutMfaLink} from "@/components/shared/about-mfa-link";
import {Button} from "@/components/shared/button";
import {SkeletonPage} from "@/components/shared/skeleton-page";
import {TextField} from "@/components/shared/text-field";
import {H1, Paragraph} from "@/components/shared/typography";
import {useCustomRouter} from "@/hooks/use-custom-router";

import {emailAtom} from "../../stores/email-magic-link";

type FormData = {
  email: string;
};

export function EnterEmailPage() {
  const t = useTranslations("enroll.email-magic-link.enter-email");
  const customRouter = useCustomRouter();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const {
    EMAIL_MAGIC_LINK: {isEditable, isHidden},
    isLoading: isTenantConfigLoading,
  } = useTenantAuthenticatorConfig();

  const [email, setEmail] = useAtom(emailAtom);

  const {
    handleSubmit,
    register,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      email,
    },
  });

  if (isTenantConfigLoading) {
    return <SkeletonPage />;
  }

  // * User shouldn't be able to get here
  if (!isEditable || isHidden) {
    router.back();
    return <SkeletonPage />;
  }

  const onSubmit = handleSubmit(({email}) => {
    setIsLoading(true);
    setEmail(email);

    customRouter.push("/enroll/email-magic-link/verify");
  });

  return (
    <>
      <EnrollmentFlowHeader isFirstStepInEnrollmentFlow={true} />
      <Main>
        <H1>{t("heading")}</H1>

        <form noValidate className="flex w-full flex-col gap-6" onSubmit={onSubmit}>
          <Paragraph className="text-center text-base">{t("description")}</Paragraph>
          <TextField
            type="email"
            autoComplete="email"
            isLabelHidden
            label={t("input.label")}
            {...register("email", {
              required: t("input.empty"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("input.invalid"),
              },
            })}
            errorMessage={errors.email?.message}
          />
          <Button isLoading={isLoading} loadingMessage={t("submit-loading")} type="submit">
            {t("submit")}
          </Button>
        </form>
        <AboutMfaLink
          fromUrl="/enroll/email-magic-link"
          verificationMethod={VerificationMethod.EMAIL_MAGIC_LINK}
          label={t("info-link")}
        />
      </Main>
    </>
  );
}
