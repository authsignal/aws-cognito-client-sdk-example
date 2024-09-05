import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import toast, { Toast } from "react-hot-toast";
import { Toaster as ToasterBase } from "react-hot-toast";

import { cn } from "@/helpers/cn";

import { Card } from "./card";

export function Toaster() {
  return (
    <ToasterBase
      containerStyle={{
        inset: "1.5rem",
      }}
      toastOptions={{
        duration: 3000,
      }}
    />
  );
}

type ToastProps = {
  activeToast: Toast;
  children: React.ReactNode;
};

export function SuccessToast({ activeToast, children }: ToastProps) {
  return (
    <Card
      wrapperClassName={cn(
        "relative max-w-md",
        activeToast.visible ? "animate-enter" : "animate-leave"
      )}
      className="items-center justify-between"
    >
      <span className="absolute left-0 h-full w-1 rounded-l-[var(--card-border-radius)] bg-positive" />
      <div
        {...activeToast.ariaProps}
        className="flex items-center gap-x-3 text-sm font-medium"
      >
        <CheckCircleIcon className="h-5 w-5 text-positive" />
        {children}
      </div>
      <div className="-m-1.5">
        <button
          type="button"
          onClick={() => toast.dismiss(activeToast.id)}
          className="focus-ring rounded p-1.5 text-icon"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">{"close-notification"}</span>
        </button>
      </div>
    </Card>
  );
}

export function ErrorToast({ activeToast, children }: ToastProps) {
  return (
    <Card
      wrapperClassName={cn(
        "relative max-w-md",
        activeToast.visible ? "animate-enter" : "animate-leave"
      )}
      className="items-center justify-between"
    >
      <span className="absolute left-0 h-full w-1 rounded-l-[var(--card-border-radius)] bg-critical" />
      <div
        {...activeToast.ariaProps}
        className="flex items-center gap-x-3 text-sm font-medium"
      >
        <ExclamationCircleIcon className="h-5 w-5 text-critical" />
        {children}
      </div>
      <div className="-m-1.5 pl-2">
        <button
          type="button"
          onClick={() => toast.dismiss(activeToast.id)}
          className="focus-ring rounded p-1.5 text-icon"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">{"close-notification"}</span>
        </button>
      </div>
    </Card>
  );
}
