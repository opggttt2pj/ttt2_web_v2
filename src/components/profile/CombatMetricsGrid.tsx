import { StatValueGroup } from "@/components/statistics/StatMetricGroup";
import { sumNullableCounts } from "@/lib/combat-statistics";
import type { CombatMetrics } from "@/lib/player-combat-statistics";

export function CombatMetricsGrid({ stats }: { stats: CombatMetrics }) {
  // 팀 잡기 성공은 편(팀) 단위 값이라 캐릭터별(=null)에서는 잡기 성공 카드를 감춘다.
  const hasTeamThrow = stats.team_throw_attempts !== null;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {hasTeamThrow ? (
        <StatValueGroup
          title="잡기"
          columns={3}
          cards={[
            {
              title: "잡기 성공",
              values: [
                { label: "성공 횟수", value: stats.team_throw_success_count, unit: "회" },
                { label: "시도 횟수", value: stats.team_throw_attempts, unit: "회" },
                { label: "성공률", value: stats.team_throw_success_rate, unit: "%" },
              ],
            },
            {
              title: "잡기 풀기",
              values: [
                { label: "푼 횟수", value: stats.dodged_throw_count, unit: "회" },
                { label: "잡힌 횟수", value: stats.thrown_count, unit: "회" },
                { label: "성공률", value: stats.throw_defense_rate, unit: "%" },
              ],
            },
          ]}
        />
      ) : (
        <StatValueGroup
          title="잡기 풀기"
          columns={3}
          cards={[
            {
              title: "잡기 풀기",
              values: [
                { label: "푼 횟수", value: stats.dodged_throw_count, unit: "회" },
                { label: "잡힌 횟수", value: stats.thrown_count, unit: "회" },
                { label: "성공률", value: stats.throw_defense_rate, unit: "%" },
              ],
            },
          ]}
        />
      )}

      <StatValueGroup
        title="하단"
        columns={3}
        cards={[
          {
            title: "하단 성공",
            values: [
              { label: "성공 횟수", value: stats.low_blow_count, unit: "회" },
              {
                label: "시도 횟수",
                value: sumNullableCounts(stats.low_blow_count, stats.low_blow_dodged_count),
                unit: "회",
              },
              { label: "성공률", value: stats.low_blow_success_rate, unit: "%" },
            ],
          },
          {
            title: "하단 가드",
            values: [
              { label: "가드 횟수", value: stats.dodged_low_blow_count, unit: "회" },
              {
                label: "적 하단 공격 횟수",
                value: sumNullableCounts(stats.dodged_low_blow_count, stats.low_blowed_count),
                unit: "회",
              },
              { label: "가드율", value: stats.low_blow_defense_rate, unit: "%" },
            ],
          },
        ]}
      />

      <StatValueGroup
        title="카운터"
        columns={3}
        cards={[
          {
            title: "카운터",
            values: [
              { label: "적중 횟수", value: stats.counter_attack_count, unit: "회" },
              { label: "피격 횟수", value: stats.counter_attacked_count, unit: "회" },
            ],
          },
        ]}
      />

      <StatValueGroup
        title="태그 · 콤보"
        columns={2}
        cards={[
          {
            title: "태그 어썰트 콤보",
            values: [
              { label: "총 횟수", value: stats.tag_assault_count, unit: "회" },
              { label: "경기당 평균 횟수", value: stats.tag_assault_avg, unit: "회" },
            ],
          },
          {
            title: "태그 체인지 콤보",
            values: [
              { label: "총 횟수", value: stats.tag_combo_count, unit: "회" },
              { label: "경기당 평균 횟수", value: stats.tag_combo_avg, unit: "회" },
            ],
          },
          {
            title: "최고 콤보 타수",
            values: [
              { label: "일반", value: stats.combo_hit_plain_max, unit: "타" },
              { label: "기믹", value: stats.combo_hit_gimmick_max, unit: "타" },
            ],
          },
          {
            title: "평균 콤보 타수",
            values: [
              { label: "일반", value: stats.combo_hit_plain_avg, unit: "타" },
              { label: "기믹", value: stats.combo_hit_gimmick_avg, unit: "타" },
            ],
          },
        ]}
      />
    </div>
  );
}
