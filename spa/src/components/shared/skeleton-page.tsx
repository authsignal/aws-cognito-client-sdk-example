"use client";

import { twMerge } from "tailwind-merge";

import { Mode } from "@/store";
import { useLocation } from "react-router-dom";

/**
 * A skeleton loader that looks like the OTP challenge page
 */

function SkeletonPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const mode = searchParams.get("mode") as Mode;

  const isPopupMode = mode === "popup";

  return (
    <Skeleton>
      {!isPopupMode ? <SkeletonBlock className="h-8 w-28" /> : null}
      <SkeletonText size={isPopupMode ? "xl" : "2xl"}>
        Enter code from app
      </SkeletonText>
      <SkeletonText>
        Enter the authentication code shown in your authenticator app to
        continue.
      </SkeletonText>
      <div className="flex gap-1">
        <SkeletonBlock className="h-13 w-13" />
        <SkeletonBlock className="h-13 w-13" />
        <SkeletonBlock className="h-13 w-13" />
        <SkeletonBlock className="h-13 w-13" />
        <SkeletonBlock className="h-13 w-13" />
        <SkeletonBlock className="h-13 w-13" />
      </div>
      <SkeletonText>Use another authentication method</SkeletonText>
      <SkeletonText>About multi-factor authentication</SkeletonText>
    </Skeleton>
  );
}

type SkeletonProps = {
  children: React.ReactNode;
  className?: string;
};

function Skeleton({ children, className }: SkeletonProps) {
  return (
    <>
      <span role="status" className="sr-only">
        {"loading"}
      </span>
      <div
        aria-hidden
        className={twMerge(
          "custom-content-alignment flex flex-col gap-6",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

type SkeletonBlockProps = {
  className?: string;
};

function SkeletonBlock(props: SkeletonBlockProps) {
  const className = twMerge(
    "h-12 w-full bg-gray-200 rounded animate-pulse",
    props.className
  );

  return <div className={className} />;
}

const sizeToTextClass = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl font-display",
  "2xl": "text-2xl font-display",
};

type SkeletonTextProps = JSX.IntrinsicElements["div"] & {
  size?: "sm" | "base" | "lg" | "xl" | "2xl";
};

function SkeletonText({
  className,
  size = "base",
  children,
  ...rest
}: SkeletonTextProps) {
  const classes = twMerge(
    "inline-block bg-gray-200 rounded animate-pulse",
    className,
    sizeToTextClass[size]
  );

  return (
    <span className={classes} {...rest}>
      <span className="custom-text-alignment opacity-0">{children}</span>
    </span>
  );
}

export { SkeletonPage, Skeleton, SkeletonBlock, SkeletonText };
