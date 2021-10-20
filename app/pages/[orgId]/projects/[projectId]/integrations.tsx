import { useRouter } from "next/router";

export default function IntegrationsScreen() {
  const router = useRouter();
  const { projectId } = router.query;

  return <h1>Project #{projectId} - Integrations</h1>;
}
