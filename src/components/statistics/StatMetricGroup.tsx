export type StatMetric = {
  label: string;
  count: number | null;
  rate?: number | null;
  unit?: "회" | "타";
};

function countLabel(value: number | null, unit?: "회" | "타") {
  return value === null ? "—" : `${value}${unit ?? "회"}`;
}

function rateLabel(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

function MetricLine({
  label,
  count,
  rate,
  unit,
  showRate,
}: StatMetric & { showRate: boolean }) {
  return (
    <div
      className={`grid min-w-0 items-center gap-2 border-b border-[var(--line)]/70 py-1.5 last:border-0 ${
        showRate ? "grid-cols-[minmax(0,1fr)_3rem_3.75rem]" : "grid-cols-[minmax(0,1fr)_3rem]"
      }`}
    >
      <span className="text-xs leading-tight text-[var(--muted)]">{label}</span>
      <span className="text-right text-xs font-semibold tabular-nums text-[var(--text)]">
        {countLabel(count, unit)}
      </span>
      {showRate ? (
        <span className="text-right text-xs font-semibold tabular-nums text-[var(--cyan)]">
          {rate === undefined ? "" : rateLabel(rate)}
        </span>
      ) : null}
    </div>
  );
}

function countHeaderText(metrics: StatMetric[]) {
  const units = new Set(metrics.map((metric) => metric.unit ?? "회"));
  if (units.size > 1) return "";
  return units.has("타") ? "타수" : "횟수";
}

export function StatMetricGroup({
  title,
  metrics,
}: {
  title: string;
  metrics: StatMetric[];
}) {
  const hasRateColumn = metrics.some((metric) => metric.rate !== undefined);
  const countHeader = countHeaderText(metrics);

  return (
    <section className="rounded-lg border border-[var(--line)] bg-[rgba(5,13,26,0.38)] px-3 py-2">
      <div
        className={`mb-1 grid items-center gap-2 ${
          hasRateColumn
            ? "grid-cols-[minmax(0,1fr)_3rem_3.75rem]"
            : "grid-cols-[minmax(0,1fr)_3rem]"
        }`}
      >
        <h5 className="text-xs font-bold text-[var(--text)]">{title}</h5>
        <span className="text-right text-[9px] font-medium text-[var(--muted)]">
          {countHeader}
        </span>
        {hasRateColumn ? (
          <span className="text-right text-[9px] font-medium text-[var(--muted)]">
            성공률
          </span>
        ) : null}
      </div>
      {metrics.map((metric) => (
        <MetricLine key={metric.label} showRate={hasRateColumn} {...metric} />
      ))}
    </section>
  );
}

export type StatValueItem = {
  label: string;
  value: number | null;
  unit?: "회" | "%" | "타";
};

export type StatValueCard = {
  title: string;
  values: StatValueItem[];
};

function valueLabel(item: StatValueItem) {
  if (item.value === null) return "—";
  if (item.unit === "%") return `${item.value.toFixed(1)}%`;
  return `${item.value}${item.unit ?? "회"}`;
}

function valueColumnCount(length: number, columns?: 1 | 2 | 3) {
  if (columns === 3) return "grid-cols-3";
  if (columns === 2) return "grid-cols-2";
  if (columns === 1) return "grid-cols-1";
  if (length >= 3) return "grid-cols-3";
  if (length === 2) return "grid-cols-2";
  return "grid-cols-1";
}

export function StatValueGroup({
  title,
  cards,
  columns,
}: {
  title: string;
  cards: StatValueCard[];
  columns?: 1 | 2 | 3;
}) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[rgba(5,13,26,0.38)] px-3 py-2">
      <h5 className="mb-2 text-xs font-bold text-[var(--text)]">{title}</h5>
      <div className="grid gap-2">
        {cards.map((card) => (
          <div
            className="rounded-lg border border-[var(--line)] bg-[rgba(12,21,32,0.65)] px-2.5 py-2"
            key={card.title}
          >
            <h6 className="text-xs font-semibold text-[var(--text)]">
              {card.title}
            </h6>
            <div
              className={`mt-2 grid gap-2 border-t border-[var(--line)]/70 pt-2 ${valueColumnCount(
                card.values.length,
                columns,
              )}`}
            >
              {card.values.map((item) => (
                <div className="min-w-0" key={`label-${item.label}`}>
                  <p className="text-[10px] leading-tight text-[var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>
            <div
              className={`mt-1 grid gap-2 ${valueColumnCount(card.values.length, columns)}`}
            >
              {card.values.map((item) => (
                <div className="min-w-0" key={item.label}>
                  <p
                    className={`text-sm font-bold tabular-nums ${
                      item.unit === "%" ? "text-[var(--cyan)]" : "text-[var(--text)]"
                    }`}
                  >
                    {valueLabel(item)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
