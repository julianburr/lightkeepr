import { Auth } from "src/components/auth";
import { AppLayout } from "src/layouts/app";

export default function OrganisationDashboard() {
  return (
    <Auth>
      <AppLayout>
        <p>Organisation Dashboard</p>
      </AppLayout>
    </Auth>
  );
}
