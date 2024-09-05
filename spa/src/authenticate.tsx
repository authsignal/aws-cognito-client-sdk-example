import { EmailMagicLinkChallengePage } from "./email-magic-link/email-magic-link-challenge-page";
import { TokenSwapper } from "./token-swapper";

type Props = {
  initialToken: string;
};

export function Authenticate({ initialToken }: Props) {
  return (
    <TokenSwapper initialToken={initialToken}>
      <EmailMagicLinkChallengePage />
    </TokenSwapper>
  );
}
