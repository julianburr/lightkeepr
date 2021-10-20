import { getFirestore, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCallback } from "react";

import { useDocument } from "src/@packages/firebase";
import { useSuspense } from "src/utils/suspense";

const db = getFirestore();

export default function SubscriptionSettingsScreen() {
  const router = useRouter();
  const { orgId } = router.query;

  const org = useDocument(doc(db, "organisations", orgId));

  const data = useSuspense(
    () =>
      fetch(`/api/stripe/customers/${org.stripeCustomerId}`).then((res) =>
        res.json()
      ),
    "customer"
  );
  console.log({ data });

  const subscription = data?.subscriptions?.[0];
  const paymentMethod = data?.paymentMethods?.[0];

  return (
    <>
      <h1>Subscription Settings</h1>

      <Link href={`/${orgId}/settings/subscription/invoices`}>
        <a>Go to invoices</a>
      </Link>

      <h2>Plans</h2>
      {subscription ? (
        <button onClick={() => {}}>Cancel Subscription</button>
      ) : (
        <button
          onClick={async () => {
            const res = await fetch(
              `/api/stripe/customers/${org.stripeCustomerId}/checkout/create` +
                `?priceId=price_1JdcA1EJ4yzs1jO8mG6PVh4p&orgId=${orgId}`
            );
            const checkoutSession = await res.json();
            if (checkoutSession?.url) {
              router.push(checkoutSession.url);
            }
          }}
        >
          Subscribe
        </button>
      )}

      <h2>Payment method</h2>
      <p>Name: {paymentMethod?.billing_details?.name}</p>
      <p>Email: {paymentMethod?.billing_details?.email}</p>
      <p>
        Card: {paymentMethod?.card?.brand} ending in{" "}
        {paymentMethod?.card?.last4} - expires {paymentMethod?.card?.exp_month}/
        {paymentMethod?.card?.exp_year}
      </p>
    </>
  );
}
