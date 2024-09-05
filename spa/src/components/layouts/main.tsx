import { twMerge } from "tailwind-merge";

type MainProps = {
  children: React.ReactNode;
  className?: string;
};

function Main({ children, className }: MainProps) {
  return (
    <main
      className={twMerge(
        "custom-content-alignment flex flex-col gap-y-4",
        className
      )}
    >
      {children}
    </main>
  );
}

export { Main };
