"use client";

import { useState } from "react";
import { CombatMetricsGrid } from "@/components/profile/CombatMetricsGrid";
import { CharacterPickerModal } from "@/components/profile/CharacterPickerModal";
import { CharacterImage } from "@/components/matches/CharacterImage";
import { usePlayerCombatStatistics } from "@/hooks/usePlayerCombatStatistics";
import { characterLabel } from "@/lib/matches";
import type { PlayerCombatStatistics } from "@/lib/player-combat-statistics";

// 캐릭터별 카드는 상위 5개만 나열하고, 나머지는 선택 모달로 고른다.
const TOP_CHARACTER_COUNT = 5;

type CharacterStat = PlayerCombatStatistics["characters"][number];

export function ProfileCombatStats({ playerName }: { playerName: string }) {
  const { data, loading, error } = usePlayerCombatStatistics(playerName);
  const [expandedCharacter, setExpandedCharacter] = useState<number | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!data && loading) {
    return (
      <section
        className="mb-3 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 text-sm text-slate-300/80"
        role="status"
      >
        전투 스탯을 불러오는 중입니다.
      </section>
    );
  }

  if (!data && error) {
    return (
      <section
        className="mb-3 rounded-2xl border border-rose-500/30 bg-rose-950/25 p-4 text-rose-100"
        role="alert"
      >
        <strong className="block text-sm font-semibold">
          전투 스탯을 불러오지 못했습니다.
        </strong>
        <p className="mt-1 text-sm text-rose-100/80">{error}</p>
      </section>
    );
  }

  if (!data) return null;

  const characters = data.characters;
  const topCharacters = characters.slice(0, TOP_CHARACTER_COUNT);
  const selectedCharacter =
    selectedCharacterId === null
      ? null
      : characters.find((character) => character.character_id === selectedCharacterId) ??
        null;
  const selectedInTopList =
    selectedCharacter !== null &&
    topCharacters.some(
      (character) => character.character_id === selectedCharacter.character_id,
    );

  const renderCharacterCard = (character: CharacterStat) => {
    const expanded = expandedCharacter === character.character_id;
    return (
      <article
        className="rounded-xl border border-slate-700/80 bg-slate-900/45 p-3"
        key={character.character_id}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <CharacterImage
              id={character.character_id}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 [&>img]:h-12 [&>img]:w-12 [&>img]:object-contain"
            />
            <div className="min-w-0">
              <h5 className="truncate text-sm font-semibold text-white">
                {characterLabel(character.character_id)}
              </h5>
              <p className="mt-0.5 text-xs text-slate-400">
                {character.matches}전 {character.wins}승 · 승률 {character.rate.toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            메인 {character.main_uses}회 · 서브 {character.sub_uses}회
          </p>
        </div>
        <div className="mt-3 border-t border-slate-700/70 pt-2">
          <button
            type="button"
            className="theme-button inline-flex min-h-8 items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold transition-colors hover:border-cyan-400/40 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            aria-expanded={expanded}
            aria-controls={`character-detail-${character.character_id}`}
            onClick={() =>
              setExpandedCharacter(
                expanded ? null : character.character_id,
              )
            }
          >
            {expanded ? "상세 스탯 닫기" : "상세 스탯 보기"}
            <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          </button>
          {expanded ? (
            <div
              id={`character-detail-${character.character_id}`}
              className="pt-3"
            >
              <CombatMetricsGrid stats={character.stats} />
            </div>
          ) : null}
        </div>
      </article>
    );
  };

  return (
    <section className="mb-3 rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-800/95 to-slate-900/95 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.18)] sm:p-5">
      <header className="mb-4">
        <p className="text-[11px] font-bold tracking-[1.2px] text-slate-400 uppercase">
          COMBAT STATISTICS
        </p>
        <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-white">
          전투 스탯 요약
        </h3>
      </header>

      {data.summary.stats_matches === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-700 px-4 py-6 text-center text-sm text-slate-300/80">
          아직 전투 스탯이 저장된 경기가 없습니다.
        </p>
      ) : (
        <>
          {error ? (
            <p className="mb-3 text-xs text-amber-200" role="status">
              최신 스탯을 갱신하지 못해 저장된 내용을 표시하고 있습니다.
            </p>
          ) : null}

          <div className="mb-5">
            <h4 className="mb-2 text-sm font-bold text-white">전체 캐릭터 합계</h4>
            <CombatMetricsGrid stats={data.overall} />
          </div>

          <div>
            <div className="mb-2 flex items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-white">캐릭터별</h4>
              <span className="rounded-full border border-slate-600/80 bg-slate-700/30 px-2 py-1 text-[11px] font-medium text-slate-200">
                TOP {TOP_CHARACTER_COUNT} · 경기 수
              </span>
            </div>
            {characters.length ? (
              <>
                <div className="grid gap-2">
                  {topCharacters.map(renderCharacterCard)}
                </div>

                <div className="mt-3 border-t border-slate-700/70 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        다른 캐릭터 스탯 보기
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        캐릭터를 선택해주세요.
                      </p>
                    </div>
                    <button
                      className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/60"
                      type="button"
                      onClick={() => setPickerOpen(true)}
                    >
                      {selectedCharacterId === null ? "캐릭터 선택" : "캐릭터 변경"}
                      <svg
                        className="h-4 w-4 text-slate-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  {selectedCharacter && !selectedInTopList ? (
                    <div className="mt-3">{renderCharacterCard(selectedCharacter)}</div>
                  ) : null}
                  {selectedInTopList ? (
                    <p className="mt-2 text-xs text-slate-400">
                      선택한 캐릭터는 위 목록에 표시되어 있습니다.
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-300/80">
                캐릭터별 스탯 데이터가 없습니다.
              </p>
            )}
            {data.characters_truncated ? (
              <p className="mt-2 text-xs text-slate-400">
                캐릭터가 {data.character_count}종이라 사용 횟수 상위 100종만 표시합니다.
              </p>
            ) : null}
          </div>
        </>
      )}

      {pickerOpen ? (
        <CharacterPickerModal
          characters={characters}
          selectedCharacterId={selectedCharacterId}
          onSelect={setSelectedCharacterId}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </section>
  );
}
