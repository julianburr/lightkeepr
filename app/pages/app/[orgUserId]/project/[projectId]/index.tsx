import { Auth } from "src/components/auth";
import { AppLayout } from "src/layouts/app";

export default function ProjectDetails() {
  return (
    <Auth>
      <AppLayout>
        <p>Project Details</p>
      </AppLayout>
    </Auth>
  );
}
