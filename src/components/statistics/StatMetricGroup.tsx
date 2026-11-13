export type StatMetric = {
  label: string;
  count: number | null;
  rate?: number | null;
};

function countLabel(value: number | null) {
  return value === null ? "—" : `${value}회`;
}

function rateLabel(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

function MetricLine({
  label,
  count,
  rate,
}: StatMetric) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_3rem_3.75rem] items-center gap-2 border-b border-[var(--line)]/70 py-1.5 last:border-0">
      <span className="truncate text-xs text-[var(--muted)]">{label}</span>
      <span className="text-right text-xs font-semibold tabular-nums text-[var(--text)]">
        {countLabel(count)}
      </span>
      <span className="text-right text-xs font-semibold tabular-nums text-[var(--cyan)]">
        {rate === undefined ? "" : rateLabel(rate)}
      </span>
    </div>
  );
}

export function StatMetricGroup({
  title,
  metrics,
}: {
  title: string;
  metrics: StatMetric[];
}) {
  const hasRateColumn = metrics.some((metric) => metric.rate !== undefined);

  return (
    <section className="rounded-lg border border-[var(--line)] bg-[rgba(5,13,26,0.38)] px-3 py-2">
      <div className="mb-1 grid grid-cols-[minmax(0,1fr)_3rem_3.75rem] items-center gap-2">
        <h5 className="text-xs font-bold text-[var(--text)]">{title}</h5>
        <span className="text-right text-[9px] font-medium text-[var(--muted)]">
          횟수
        </span>
        {hasRateColumn ? (
          <span className="text-right text-[9px] font-medium text-[var(--muted)]">
            성공률
          </span>
        ) : null}
      </div>
      {metrics.map((metric) => (
        <MetricLine key={metric.label} {...metric} />
      ))}
    </section>
  );
}

export type StatValueItem = {
  label: string;
  value: number | null;
  unit?: "회" | "%";
};

export type StatValueCard = {
  title: string;
  values: StatValueItem[];
};

function valueLabel(item: StatValueItem) {
  if (item.value === null) return "—";
  return item.unit === "%" ? `${item.value.toFixed(1)}%` : `${item.value}회`;
}

function valueColumnCount(length: number) {
  if (length >= 3) return "grid-cols-3";
  if (length === 2) return "grid-cols-2";
  return "grid-cols-1";
}

export function StatValueGroup({
  title,
  cards,
}: {
  title: string;
  cards: StatValueCard[];
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
              )}`}
            >
              {card.values.map((item) => (
                <div className="min-w-0" key={`label-${item.label}`}>
                  <p className="text-[10px] leading-tight text-[var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>
            <div
              className={`mt-1 grid gap-2 ${valueColumnCount(card.values.length)}`}
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
