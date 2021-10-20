import { getFirestore, doc } from "firebase/firestore";
import { useRouter } from "next/router";

import { useDocument } from "src/@packages/firebase";
import { useSuspense } from "src/utils/suspense";

const db = getFirestore();

export default function InvoicesScreen() {
  const router = useRouter();
  const { orgId } = router.query;

  const org = useDocument(doc(db, "organisations", orgId));

  const invoices = useSuspense(
    () =>
      fetch(`/api/stripe/customers/${org.stripeCustomerId}/invoices`).then(
        (res) => res.json()
      ),
    "invoices"
  );

  return (
    <>
      <h1>Invoices</h1>
      <ul>
        {invoices?.data?.map?.((invoice) => (
          <li key={invoice.id}>#{invoice.number}</li>
        ))}
      </ul>
    </>
  );
}
