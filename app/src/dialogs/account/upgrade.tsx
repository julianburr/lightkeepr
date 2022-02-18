import { Dialog } from "src/components/dialog";
import { P } from "src/components/text";

export function UpgradeDialog() {
  return (
    <Dialog title="Upgrade to Premium">
      <P>
        You'll need to upgrade your team to the premium subscription before you
        can use this feature. Learn more{" "}
        <a href="/pricing" target="_blank">
          about the plans &amp; pricing
        </a>
        .
      </P>
    </Dialog>
  );
}
