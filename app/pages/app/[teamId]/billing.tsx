import "src/utils/firebase";

import dayjs from "dayjs";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { useSuspense } from "src/@packages/suspense";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { List } from "src/components/list";
import { Loader } from "src/components/loader";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { Heading, P, Small } from "src/components/text";
import { Value } from "src/components/value";
import { useConfirmationDialog } from "src/dialogs/confirm";
import { env } from "src/env";
import { useApi } from "src/hooks/use-api";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";
import { AppLayout } from "src/layouts/app";
import { InvoiceListItem } from "src/list-items/invoice";
import { PaymentMethodListItem } from "src/list-items/payment-method";
import { stripeClient } from "src/utils/stripe";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

const WrapPaymentMethod = styled.div`
  width: 100%;

  @media (min-width: 800px) {
    max-width: 28rem;
  }
`;

type SectionProps = {
  uuid: string;
  refresh: () => void;
};

function PlanDetails({ uuid, refresh }: SectionProps) {
  const authUser = useAuthUser();
  const api = useApi();

  const toast = useToast();
  const confirmationDialog = useConfirmationDialog();

  const customerId = authUser?.team?.stripeCustomerId;
  const details = useSuspense(
    () =>
      api.get(`/api/stripe/customers/${customerId}`).then(async ({ data }) => {
        // Check subsrciption status && potentially update team plan
        const subscription = data?.subscriptions?.[0];

        const plan = subscription
          ? ["incomplete_expired", "unpaid"].includes(subscription.status)
            ? "free"
            : subscription.status === "cancelled" &&
              new Date(subscription.current_period_end * 1000) <= new Date()
            ? "free"
            : "premium"
          : "free";
        const stripeStatus = subscription?.status || null;

        if (
          authUser.team!.plan !== plan ||
          authUser.team!.stripeStatus !== stripeStatus
        ) {
          await updateDoc(doc(db, "teams", authUser.team!.id), {
            plan,
            stripeStatus,
          });
        }

        return data;
      }),
    { key: `${customerId}/details/${uuid}` }
  );

  if (!details?.subscriptions?.length) {
    return (
      <>
        <P>Free — $0 / month</P>
        {["owner", "billing"].includes(authUser.teamRole!) && (
          <Button
            onClick={async () => {
              const session: any = await api
                .post(
                  `/api/stripe/customers/${customerId}/subscriptions/session`,
                  {
                    teamId: authUser?.team?.id,
                    priceId: env.stripe.priceId.premium.monthly,
                    redirectUrl: `/app/${authUser?.team?.id}/billing`,
                  }
                )
                .then(({ data }) => data);

              const stripe = await stripeClient();
              await stripe.redirectToCheckout({ sessionId: session?.id });
            }}
          >
            Upgrade to premium plan
          </Button>
        )}
      </>
    );
  }

  const subscription = details.subscriptions[0];
  const item = subscription.items?.data?.[0];

  return (
    <>
      <P>
        Premium — ${item.plan.amount / 100} / {item.plan.interval}
      </P>
      {["owner", "billing"].includes(authUser.teamRole!) ? (
        subscription.cancel_at_period_end ? (
          <>
            <Small>
              Cancelled at end of current period (
              {dayjs(subscription.current_period_end * 1000).format("D MMM")})
            </Small>
            <Button
              onClick={async () => {
                await api.post(
                  `/api/stripe/customers/${customerId}/subscriptions/${subscription.id}/uncancel`
                );
                toast.show({
                  message: "Subscription successfully un-cancelled",
                });
                refresh();
              }}
            >
              Un-cancel subscription
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              confirmationDialog.open({
                message:
                  "Are you sure you want to cancel your current subscription? You will still " +
                  "have access to premium features until your current subscription periond " +
                  "expires.",
                confirmLabel: "Cancel subscription",
                intent: "danger",
                onConfirm: async () => {
                  await api.post(
                    `/api/stripe/customers/${customerId}/subscriptions/${subscription.id}/cancel`
                  );
                  toast.show({
                    message: "Subscription successfully cancelled",
                  });
                  refresh();
                },
              });
            }}
          >
            Cancel subscription
          </Button>
        )
      ) : null}
    </>
  );
}

function BillingDetails({ uuid }: SectionProps) {
  const authUser = useAuthUser();
  const api = useApi();

  const customerId = authUser?.team?.stripeCustomerId;
  const details = useSuspense(
    () =>
      api.get(`/api/stripe/customers/${customerId}`).then(({ data }) => data),
    { key: `${customerId}/details/${uuid}` }
  );

  return (
    <>
      <Value label="Name" value={details.name} />
      <Spacer h="1.2rem" />

      <Value label="Email" value={details.email} />
      <Spacer h="1.2rem" />

      {details.paymentMethods?.length > 0 && (
        <>
          <Value
            label="Payment method"
            value={
              <WrapPaymentMethod>
                <PaymentMethodListItem data={details.paymentMethods[0]} />
              </WrapPaymentMethod>
            }
          />
          <Spacer h="1.2rem" />
          <Button
            onClick={async () => {
              const subscriptionId = details?.subscription?.data?.[0]?.id;
              const session: any = await api
                .post(
                  `/api/stripe/customers/${customerId}/subscriptions/${subscriptionId}/session`,
                  { teamId: authUser?.team?.id }
                )
                .then(({ data }) => data);

              const stripe = await stripeClient();
              await stripe.redirectToCheckout({ sessionId: session?.id });
            }}
          >
            Update payment method
          </Button>
        </>
      )}
    </>
  );
}

function InvoicesDetails({ uuid }: SectionProps) {
  const authUser = useAuthUser();
  const api = useApi();

  const customerId = authUser?.team?.stripeCustomerId;
  const invoices = useSuspense(
    () =>
      api
        .get(`/api/stripe/customers/${customerId}/invoices`)
        .then(({ data }) => data),
    { key: `${customerId}/invoices/${uuid}` }
  );

  return <List items={invoices?.data || []} Item={InvoiceListItem} />;
}

export default function Billing() {
  const [uuid, setUuid] = useState(0);
  const refresh = () => setUuid((state) => state + 1);

  const authUser = useAuthUser();

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (router.query.status && router.query.sessionId) {
      switch (router.query.status) {
        case "success":
          updateDoc(doc(db, "teams", authUser.team!.id), {
            plan: "premium",
          });
          // TODO: update team entry in firebase
          router.replace({
            pathname: router.pathname,
            query: { teamId: router.query.teamId },
          });
          break;

        case "failed":
          router.replace({
            pathname: router.pathname,
            query: { teamId: router.query.teamId },
          });
          toast.show({
            intent: "error",
            message: "Something went wrong during the subscription process",
          });
          break;
      }
    }
  }, [router.query.status, router.query.sessionId]);

  return (
    <Auth>
      <AppLayout>
        <Heading level={1}>Subscription &amp; billing</Heading>
        <Spacer h="2.4rem" />

        <Suspense fallback={<Loader />}>
          <section>
            <Heading level={2}>Current plan</Heading>
            <Spacer h=".8rem" />
            <PlanDetails uuid={`${uuid}`} refresh={refresh} />
            <Spacer h="3.6rem" />
          </section>

          {["owner", "billing"].includes(authUser.teamRole!) ? (
            <>
              <section>
                <Heading level={2}>Billing details</Heading>
                <Spacer h="1.2rem" />
                <BillingDetails uuid={`${uuid}`} refresh={refresh} />
              </section>

              <Spacer h="3.6rem" />

              <section>
                <Heading level={2}>Invoices</Heading>
                <Spacer h="1.2rem" />
                <InvoicesDetails uuid={`${uuid}`} refresh={refresh} />
              </section>
            </>
          ) : (
            <>
              <section>
                <Heading level={2}>Billing details</Heading>
                <Spacer h="1.2rem" />
                <Container>
                  <P>
                    You don't have the required permissions to see billing
                    information. Ask one of the current team owners to assign
                    you the "billing manager" role to see details here.
                  </P>
                </Container>
              </section>
            </>
          )}
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
