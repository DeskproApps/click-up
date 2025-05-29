import * as Sentry from "@sentry/react";

const urlParams = new URLSearchParams(document.location.search);
const sentryDsn = urlParams.get('_sentry_dsn');
const sentryTunnel = urlParams.get('_sentry_tunnel') || undefined;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    sendDefaultPii: false,
    tunnel: sentryTunnel
  });
}