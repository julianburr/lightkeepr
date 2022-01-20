import { Auth } from "src/components/auth";
import { AppLayout } from "src/layouts/app";

export default function Billing() {
  return (
    <Auth>
      <AppLayout>
        <p>Organisation Billing</p>
      </AppLayout>
    </Auth>
  );
}
