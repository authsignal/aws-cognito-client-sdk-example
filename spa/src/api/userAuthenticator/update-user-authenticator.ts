import { useMutation } from "@tanstack/react-query";

import { useSignalApi } from "@/lib/signal-api";

import { SmsChannel } from "./types";

type UpdateUserAuthenticatorParams = {
  userAuthenticatorId: string;
  previousSmsChannel: SmsChannel;
};

export function useUpdateUserAuthenticator() {
  const { api } = useSignalApi();

  return useMutation({
    mutationFn: ({
      userAuthenticatorId,
      ...rest
    }: UpdateUserAuthenticatorParams) =>
      api.patch(`v1/client/user-authenticators/${userAuthenticatorId}`, {
        json: rest,
      }),
  });
}
