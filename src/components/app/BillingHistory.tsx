"use client";

import { useEffect, useState } from "react";
import LocalTime from "@/components/app/LocalTime";
import { Receipt } from "@/components/site/icons";
import type { PatientAppointment } from "@/lib/types";

function money(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

function invoiceNumber(item: PatientAppointment) {
  return `SW-${item.created_at.slice(0, 4)}-${item.id.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

const STATUS_STYLE = {
  paid: "bg-sage-soft text-sage",
  demo: "bg-brand-50 text-brand-600",
  refunded: "bg-paper-sunk text-ink-soft",
  failed: "bg-coral-soft text-coral",
};

export default function BillingHistory({
  appointments,
}: {
  appointments: PatientAppointment[];
}) {
  const [selected, setSelected] = useState<PatientAppointment | null>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-card p-6 text-sm text-ink-soft">
        No billing records yet.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-hairline bg-card">
        <table className="w-full min-w-160 border-collapse text-left text-sm">
          <thead className="bg-paper-sunk/70 text-xs uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-5 py-3 font-medium">Invoice</th>
              <th className="px-5 py-3 font-medium">Therapist</th>
              <th className="px-5 py-3 font-medium">Booked</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(item);
                  }
                }}
                className="border-t border-hairline transition-colors hover:bg-brand-50/60 focus-visible:bg-brand-50"
              >
                <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink">
                  {invoiceNumber(item)}
                </td>
                <td className="px-5 py-3.5 text-ink-soft">
                  {item.therapist?.name ?? "Therapist"}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-ink-faint">
                  <LocalTime iso={item.created_at} mode="date" />
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium text-ink">
                  {money(item.amount_cents, item.currency)}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[item.payment_status]}`}
                  >
                    {item.payment_status === "demo" ? "Demo checkout" : item.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-brand-900/55 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="billing-detail-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-hairline bg-card shadow-lift"
          >
            <div className="flex items-start justify-between border-b border-hairline p-5">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand">
                  <Receipt className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-faint">
                    Billing detail
                  </p>
                  <h3
                    id="billing-detail-title"
                    className="font-display text-xl font-semibold text-ink"
                  >
                    {invoiceNumber(selected)}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close billing detail"
                className="grid h-9 w-9 place-items-center rounded-full text-xl text-ink-faint hover:bg-paper-sunk hover:text-ink"
              >
                ×
              </button>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 p-5 sm:grid-cols-2">
              <Detail label="Therapist" value={selected.therapist?.name ?? "Therapist"} />
              <Detail
                label="Appointment"
                value={<LocalTime iso={selected.start_time} mode="day-time" />}
              />
              <Detail label="Visit type" value={selected.visit_type.replace("_", "-")} />
              <Detail label="Reason" value={selected.reason || "Therapy session"} />
              <Detail
                label="Payment method"
                value={selected.stripe_session_id ? "Stripe Checkout" : "Demo checkout"}
              />
              <Detail
                label="Payment date"
                value={
                  selected.paid_at ? (
                    <LocalTime iso={selected.paid_at} mode="day-time" />
                  ) : (
                    "Not charged"
                  )
                }
              />
              {selected.stripe_session_id && (
                <div className="sm:col-span-2">
                  <Detail label="Stripe reference" value={selected.stripe_session_id} />
                </div>
              )}
            </dl>

            <div className="flex items-center justify-between border-t border-hairline bg-paper-sunk/60 px-5 py-4">
              <span className="text-sm font-medium capitalize text-ink-soft">
                {selected.payment_status === "demo"
                  ? "Demo checkout"
                  : selected.payment_status}
              </span>
              <span className="font-display text-2xl font-semibold text-ink">
                {money(selected.amount_cents, selected.currency)}
              </span>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="mt-1 break-words text-sm capitalize text-ink">{value}</dd>
    </div>
  );
}
