import { Auth } from "src/components/auth";
import { AppLayout } from "src/layouts/app";

export default function AccountSettings() {
  return (
    <Auth>
      <AppLayout>
        <p>Account Settings</p>
      </AppLayout>
    </Auth>
  );
}
