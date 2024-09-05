import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type CardProps = {
  children: React.ReactNode;
  wrapperClassName?: string;
  className?: string;
};

function Card({ children, className, wrapperClassName }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "flex w-full rounded-[var(--card-border-radius)] shadow transition",
          wrapperClassName
        )
      )}
    >
      <div
        className={twMerge(
          clsx(
            "relative flex w-full rounded-[var(--card-border-radius)] bg-[color:var(--card-background-color)] p-4 ring-1 ring-[color:var(--card-border-color)] transition",
            className
          )
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { Card };
