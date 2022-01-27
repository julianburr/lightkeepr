import { useRouter } from "next/router";

import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Heading, P } from "src/components/text";
import { Spacer } from "src/components/spacer";

export default function ProjectIntegrations() {
  const router = useRouter();
  const { teamId, projectId } = router.query;

  return (
    <Auth>
      <AppLayout>
        <Heading level={1}>Project integrations</Heading>

        <Spacer h="1.2rem" />
        <P>Integrations are not implemented yet.</P>
      </AppLayout>
    </Auth>
  );
}
