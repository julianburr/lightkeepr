import { useRouter } from "next/router";

import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Heading, P } from "src/components/text";
import { BackLink } from "src/components/back-link";
import { Spacer } from "src/components/spacer";

export default function ProjectIntegrations() {
  const router = useRouter();
  const { teamId, projectId } = router.query;

  return (
    <Auth>
      <AppLayout>
        <BackLink href={`/app/${teamId}/projects/${projectId}`}>
          Back to project overview
        </BackLink>
        <Heading level={1}>Project integrations</Heading>

        <Spacer h="1.2rem" />
        <P>Integrations are not implemented yet.</P>
      </AppLayout>
    </Auth>
  );
}
