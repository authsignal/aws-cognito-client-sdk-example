import { clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

import { isInPopupMode } from "@/helpers";

type HeadingProps = {
  className?: string;
  children: React.ReactNode;
  size?: "h1" | "h2";
} & JSX.IntrinsicElements["h1"];

const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ size = "h1", className, ...rest }, ref) => {
    return (
      <h1
        className={twMerge(
          clsx(
            "custom-text-alignment text-heading-text",
            {
              h1: `${
                isInPopupMode() ? "text-xl" : "text-2xl"
              } font-display font-semibold`,
              h2: "text-xl font-semibold",
            }[size],
            className
          )
        )}
        {...rest}
        ref={ref}
      />
    );
  }
);

H1.displayName = "H1";

const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ size = "h2", className, ...rest }, ref) => {
    return (
      <h2
        className={twMerge(
          clsx(
            "custom-text-alignment text-heading-text",
            {
              h1: `${
                isInPopupMode() ? "text-xl" : "text-2xl"
              } font-display font-semibold`,
              h2: "text-xl font-semibold",
            }[size],
            className
          )
        )}
        {...rest}
        ref={ref}
      />
    );
  }
);

H2.displayName = "H2";

const bodyFontSize = {
  base: "text-base",
  sm: "text-sm",
  xs: "text-xs",
};

type ParagraphProps = {
  className?: string;
  children: React.ReactNode;
  size?: keyof typeof bodyFontSize;
} & JSX.IntrinsicElements["p"];

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ size = "base", className, ...rest }, ref) => {
    return (
      <p
        className={twMerge(
          clsx(
            "custom-text-alignment text-body-text",
            bodyFontSize[size],
            className
          )
        )}
        {...rest}
        ref={ref}
      />
    );
  }
);

Paragraph.displayName = "Paragraph";

export { H1, H2, Paragraph };
