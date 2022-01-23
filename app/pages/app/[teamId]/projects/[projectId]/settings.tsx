import { Auth } from "src/components/auth";
import { AppLayout } from "src/layouts/app";

export default function ProjectSettings() {
  return (
    <Auth>
      <AppLayout>
        <p>Project Settings</p>
      </AppLayout>
    </Auth>
  );
}
