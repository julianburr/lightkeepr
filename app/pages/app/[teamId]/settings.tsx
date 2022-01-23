import { Auth } from "src/components/auth";
import { AppLayout } from "src/layouts/app";

export default function TeamSettings() {
  return (
    <Auth>
      <AppLayout>
        <p>Team Settings</p>
      </AppLayout>
    </Auth>
  );
}
