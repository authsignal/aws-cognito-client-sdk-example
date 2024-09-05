"use client";

import { useInit } from "@/api/token/init";
import { SkeletonPage } from "@/components/shared/skeleton-page";

type TokenCheckerProps = {
  loader?: React.ReactNode;
  children: React.ReactNode;
  initialToken: string;
};

export function TokenSwapper({
  children,
  loader,
  initialToken,
}: TokenCheckerProps) {
  console.log({ initialToken });
  const { token } = useInit({ initialToken });

  if (!token) {
    return loader || <SkeletonPage />;
  }

  return children;
}
