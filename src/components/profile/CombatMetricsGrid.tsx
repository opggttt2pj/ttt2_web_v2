import { StatMetricGroup } from "@/components/statistics/StatMetricGroup";
import { sumNullableCounts } from "@/lib/combat-statistics";
import type { CombatMetrics } from "@/lib/player-combat-statistics";

export function CombatMetricsGrid({ stats }: { stats: CombatMetrics }) {
  // 팀 잡기 성공은 편(팀) 단위 값이라 캐릭터별(=null)에서는 잡기 성공 카드를 감춘다.
  const hasTeamThrow = stats.team_throw_attempts !== null;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {hasTeamThrow ? (
        <StatMetricGroup
          title="잡기 성공"
          metrics={[
            { label: "성공 횟수", count: stats.team_throw_success_count },
            {
              label: "시도 횟수",
              count: stats.team_throw_attempts,
              rate: stats.team_throw_success_rate,
            },
          ]}
        />
      ) : null}

      <StatMetricGroup
        title="잡기 풀기"
        metrics={[
          { label: "푼 횟수", count: stats.dodged_throw_count },
          {
            label: "잡힌 횟수",
            count: stats.thrown_count,
            rate: stats.throw_defense_rate,
          },
        ]}
      />

      <StatMetricGroup
        title="하단"
        metrics={[
          { label: "하단 성공", count: stats.low_blow_count },
          {
            label: "하단 시도 · 성공률",
            count: sumNullableCounts(stats.low_blow_count, stats.low_blow_dodged_count),
            rate: stats.low_blow_success_rate,
          },
          { label: "내가 피한 하단", count: stats.dodged_low_blow_count },
          { label: "내가 하단에 맞음", count: stats.low_blowed_count },
          {
            label: "하단 방어 시도 · 성공률",
            count: sumNullableCounts(stats.dodged_low_blow_count, stats.low_blowed_count),
            rate: stats.low_blow_defense_rate,
          },
        ]}
      />

      <StatMetricGroup
        title="카운터"
        metrics={[
          { label: "카운터 적중", count: stats.counter_attack_count },
          { label: "카운터 피격", count: stats.counter_attacked_count },
        ]}
      />

      <StatMetricGroup
        title="태그 · 콤보"
        metrics={[
          { label: "태그 어설트", count: stats.tag_assault_count },
          { label: "태그 콤보", count: stats.tag_combo_count },
          {
            label: "일반 콤보",
            count: stats.combo_hit_plain,
          },
          {
            label: "벽 콤보",
            count: stats.combo_hit_wall,
          },
          {
            label: "기믹 콤보",
            count: stats.combo_hit_gimmick,
          },
        ]}
      />
    </div>
  );
}
