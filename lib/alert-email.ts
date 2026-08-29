import type { TradeExposureAlertIntelligence } from "@/lib/exposure-monitoring";

export const ALERT_EMAIL_FROM_ADDRESS = "alerts@tariffcompass.ca";
export const ALERT_EMAIL_FROM_HEADER = "TariffCompass Alerts <alerts@tariffcompass.ca>";
export const ALERT_EMAIL_REPLY_TO = "support@tariffcompass.ca";

function safeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function formatDate(value: string | null): string {
  if (!value) return "Not specified";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatState(state: TradeExposureAlertIntelligence["previousState"]): string {
  if (state.kind === "known_rate") return `${state.rate}% additional counter-tariff`;
  return state.description;
}

function formatMoney(currency: string, amount: number): string {
  return `${currency} ${new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 }).format(amount)}`;
}

export type AlertEmail = {
  from: string;
  to: string;
  subject: string;
  raw: string;
};

export function buildMaterialAlertEmail(
  alertId: string,
  recipient: string,
  alert: TradeExposureAlertIntelligence,
  sentAt: Date = new Date()
): AlertEmail {
  const rate = alert.newState.kind === "known_rate" ? `+${alert.newState.rate}% counter-tariff` : "trade-policy change";
  const subject = safeHeader(`TariffCompass alert: ${alert.productDescription} affected by ${rate}`);
  const impact = formatMoney(
    alert.financialImpact.newAdditionalExposure.currency,
    alert.financialImpact.changeInAdditionalExposureMax
  );
  const confidence = `${alert.confidence.charAt(0).toUpperCase()}${alert.confidence.slice(1)}`;
  const body = [
    "TariffCompass found a material trade-policy change affecting one of your monitored exposures.",
    "",
    `${alert.productDescription} — HS ${alert.hsCode}`,
    "",
    "Change:",
    formatState(alert.previousState),
    `→ ${formatState(alert.newState)}`,
    "",
    "Effective:",
    formatDate(alert.effectiveDate),
    "",
    "Estimated incremental annual exposure:",
    impact,
    "",
    "Confidence:",
    confidence,
    "",
    "Source:",
    `${alert.source.name} — ${alert.source.url}`,
    "",
    "This is a planning estimate, not a customs-duty determination.",
    "",
    "View in TariffCompass:",
    "https://tariffcompass.ca/dashboard",
  ].join("\r\n");
  const safeRecipient = safeHeader(recipient);
  const raw = [
    `From: ${ALERT_EMAIL_FROM_HEADER}`,
    `To: ${safeRecipient}`,
    `Reply-To: ${ALERT_EMAIL_REPLY_TO}`,
    `Subject: ${subject}`,
    `Date: ${sentAt.toUTCString()}`,
    `Message-ID: <${safeHeader(alertId)}@tariffcompass.ca>`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");
  return { from: ALERT_EMAIL_FROM_ADDRESS, to: safeRecipient, subject, raw };
}
