import ua from "universal-analytics";

import { env } from "src/env";

type EventArgs = {
  uid?: string;
  category?: string;
  action: string;
  label?: string;
  value?: any;
};

export function event({
  uid,
  category = "Server Events",
  action,
  label,
  value,
}: EventArgs) {
  if (env.googleAnalyticsId) {
    const visitor = ua(env.googleAnalyticsId, { uid });
    const data = {
      ec: category,
      ea: action,
      el: label,
      ev: value,
    };
    visitor.event(data).send();
  }
}

type TransactionArgs = {
  uid?: string;
  id: string;
  amount: number;
  name?: string;
};

export function transaction({ uid, id, amount, name }: TransactionArgs) {
  if (env.googleAnalyticsId) {
    const visitor = ua(env.googleAnalyticsId, { uid });
    visitor
      .transaction({
        ti: id,
        tr: amount,
      })
      .item({
        ip: amount,
        iq: 1,
        ic: "item-subscription",
        in: "Subscription",
        iv: name,
      })
      .send();
  }
}
