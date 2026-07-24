import type { ComponentType, SVGProps } from "react";

/** Placeholder panel for dashboard areas not yet built out. */
export default function DashStub({
  title,
  blurb,
  Icon,
}: {
  title: string;
  blurb: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        {title}
      </h1>
      <div className="mt-8 grid place-items-center rounded-2xl border border-dashed border-hairline bg-card px-6 py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand">
          <Icon className="h-7 w-7" />
        </span>
        <p className="mt-5 max-w-sm text-ink-soft">{blurb}</p>
      </div>
    </div>
  );
}
