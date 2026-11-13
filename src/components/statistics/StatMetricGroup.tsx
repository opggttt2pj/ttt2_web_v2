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
