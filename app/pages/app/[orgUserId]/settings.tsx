import { Auth } from "src/components/auth";
import { AppLayout } from "src/layouts/app";

export default function OrganisationSettings() {
  return (
    <Auth>
      <AppLayout>
        <p>Organisation Settings</p>
      </AppLayout>
    </Auth>
  );
}
