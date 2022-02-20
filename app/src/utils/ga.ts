import { env } from "src/env";

export function pageView(url: string, title: string) {
  if (env.googleAnalyticsId) {
    window.gtag("config", env.googleAnalyticsId, {
      page_path: url,
      page_title: title,
    });
  }
}

export function event({
  action,
  params = {},
}: {
  action: string;
  params?: any;
}) {
  if (env.googleAnalyticsId) {
    window.gtag("event", action, params);
  }
}
