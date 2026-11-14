import { CharacterImage } from "@/components/matches/CharacterImage";
import { MatchStatGroup } from "@/components/matches/MatchStatGroup";
import { StatValueGroup } from "@/components/statistics/StatMetricGroup";
import { sumNullableCounts } from "@/lib/combat-statistics";
import type { MatchFighterDetail } from "@/lib/match-detail";

export function MatchFighterStats({
  fighter,
}: {
  fighter: MatchFighterDetail;
}) {
  return (
    <article className="rounded-xl border border-[var(--line)] bg-[rgba(12,21,32,0.55)] p-3">
      <header className="mb-3 flex items-center gap-3">
        {fighter.character_id !== null ? (
          <CharacterImage
            id={fighter.character_id}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 [&>img]:h-16 [&>img]:w-16 [&>img]:object-cover"
          />
        ) : (
          <span className="theme-surface-muted grid h-16 w-16 shrink-0 place-items-center rounded-md text-[10px] text-[var(--muted)]">
            캐릭터 없음
          </span>
        )}
        <div className="min-w-0">
          <span className="theme-surface-muted inline-flex rounded px-2 py-1 text-[10px] font-bold tracking-wide">
            {fighter.main_sub === 1 ? "메인" : "서브"}
          </span>
          <p className="mt-1 truncate text-sm font-semibold text-[var(--text)]">
            {fighter.player_name}
          </p>
          <p
            className={[
              "mt-0.5 text-xs font-bold",
              fighter.is_win === true
                ? "text-emerald-400"
                : fighter.is_win === false
                  ? "text-rose-400"
                  : "text-[var(--muted)]",
            ].join(" ")}
          >
            {fighter.is_win === true
              ? "승리"
              : fighter.is_win === false
                ? "패배"
                : "결과 미상"}
          </p>
        </div>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        <StatValueGroup
          title="잡기"
          cards={[
            {
              title: "잡기 시도",
              values: [{ label: "시도 횟수", value: fighter.throw_count, unit: "회" }],
            },
            {
              title: "잡기 풀기",
              values: [
                { label: "푼 횟수", value: fighter.dodged_throw_count, unit: "회" },
                { label: "잡힌 횟수", value: fighter.thrown_count, unit: "회" },
                { label: "성공률", value: fighter.throw_defense_rate, unit: "%" },
              ],
            },
          ]}
        />

        <StatValueGroup
          title="하단"
          cards={[
            {
              title: "하단 성공",
              values: [
                { label: "성공 횟수", value: fighter.low_blow_count, unit: "회" },
                {
                  label: "시도 횟수",
                  value: sumNullableCounts(
                    fighter.low_blow_count,
                    fighter.low_blow_dodged_count,
                  ),
                  unit: "회",
                },
                { label: "성공률", value: fighter.low_blow_success_rate, unit: "%" },
              ],
            },
            {
              title: "하단 가드",
              values: [
                { label: "가드 횟수", value: fighter.dodged_low_blow_count, unit: "회" },
                {
                  label: "적 하단 공격 횟수",
                  value: sumNullableCounts(
                    fighter.dodged_low_blow_count,
                    fighter.low_blowed_count,
                  ),
                  unit: "회",
                },
                { label: "가드율", value: fighter.low_blow_defense_rate, unit: "%" },
              ],
            },
          ]}
        />

        <MatchStatGroup
          title="카운터"
          metrics={[
            { label: "카운터 적중", count: fighter.counter_attack_count },
            { label: "카운터 피격", count: fighter.counter_attacked_count },
          ]}
        />

        <MatchStatGroup
          title="태그 · 콤보"
          metrics={[
            { label: "태그 어썰트 콤보", count: fighter.tag_assault_count },
            { label: "태그 체인지 콤보", count: fighter.tag_combo_count },
            {
              label: "최대 콤보 타수(일반)",
              count: fighter.combo_hit_plain,
              unit: "타",
            },
            {
              label: "최대 콤보 타수(기믹)",
              count: fighter.combo_hit_gimmick,
              unit: "타",
            },
          ]}
        />
      </div>
    </article>
  );
}
