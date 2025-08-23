import React from "react";
import { useLocale, useTranslations } from "use-intl";

type Rules = {
  checkInFrom?: string;
  checkInTo?: string;
  checkOutBy?: string;
};

type Cancellation = {
  policy?: "free_until_5_days" | "flexible" | "strict" | string;
  note?: string;
  note_en?: string;
};

type Props = {
  data?: {
    rules?: Rules | null;
    cancellation?: Cancellation | null;
  };
};

function formatTime(t?: string) {
  if (!t) return undefined;
  const m = t.match(/^(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return t;
  const hh = String(Math.min(23, Math.max(0, parseInt(m[1], 10)))).padStart(
    2,
    "0"
  );
  const mm = String(
    m[2] ? Math.min(59, Math.max(0, parseInt(m[2], 10))) : 0
  ).padStart(2, "0");
  return `${hh}:${mm}`;
}

function buildRulesText(rules?: Rules | null) {
  if (!rules) return "Non specificate";
  const from = formatTime(rules.checkInFrom);
  const to = formatTime(rules.checkInTo);
  const out = formatTime(rules.checkOutBy);

  const parts: string[] = [];
  if (from && to) parts.push(`Check-in: ${from}–${to}`);
  else if (from) parts.push(`Check-in: dalle ${from}`);
  else if (to) parts.push(`Check-in: fino alle ${to}`);

  if (out) parts.push(`Check-out entro le ore ${out}`);

  return parts.length ? parts.join("  •  ") : "Non specificate";
}

function buildCancellationText(c?: Cancellation | null, locale?: string) {
  if (!c) return "Contattaci per i dettagli di cancellazione";

  const mapIt: Record<string, string> = {
    free_until_5_days:
      "Cancellazione gratuita fino a 5 giorni prima dell’arrivo",
    flexible: "Politica di cancellazione flessibile",
    strict: "Politica di cancellazione rigida",
  };

  const mapEn: Record<string, string> = {
    free_until_5_days: "Free cancellation until 5 days before arrival",
    flexible: "Flexible cancellation policy",
    strict: "Strict cancellation policy",
  };

  const base = c.policy
    ? locale === "en"
      ? mapEn[c.policy] ?? "Custom cancellation policy"
      : mapIt[c.policy] ?? "Politica di cancellazione personalizzata"
    : "";

  const noteToShow =
    locale === "en" && (c as any).note_en ? (c as any).note_en : c.note;

  if (base && noteToShow) return `${base} — ${noteToShow}`;
  if (noteToShow) return noteToShow;
  return (
    base ||
    (locale === "en"
      ? "Contact us for cancellation details"
      : "Contattaci per i dettagli di cancellazione")
  );
}

export default function ApartmentRules({ data }: Props) {
  const rulesText = buildRulesText(data?.rules ?? undefined);
  const locale = useLocale();

  const cancellationText = buildCancellationText(
    data?.cancellation ?? undefined,
    locale
  );
  const t = useTranslations("apartments.rules");

  return (
    <section className="row padding-y-90-120">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <p className="ff-sans fw-400 color-black fz-21 lh-sm">
              {t("houseRules")}
            </p>
            <p className="ff-sans fw-200 color-gray fz-21 lh-sm">{rulesText}</p>
          </div>

          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <p className="ff-sans fw-400 color-black fz-21 lh-sm">
              {t("cancellationTerms")}
            </p>
            <p className="ff-sans fw-200 color-gray fz-21 lh-sm">
              {cancellationText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
