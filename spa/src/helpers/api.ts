import { AuthsignalErrorResponse } from "@/api/types";

export function getPrefixUrlForRegion(region?: string) {
  switch (region) {
    case "au":
      return process.env.NEXT_PUBLIC_AUTHSIGNAL_SIGNAL_API_HOST_AU;
    case "eu":
      return process.env.NEXT_PUBLIC_AUTHSIGNAL_SIGNAL_API_HOST_EU;
    case "us":
      return "https://api.authsignal.com";
    default: {
      return "https://api.authsignal.com";
    }
  }
}

export function logErrorResponse(errorResponse: AuthsignalErrorResponse) {
  console.error(`${errorResponse.error}: ${errorResponse.errorDescription}`);
}
