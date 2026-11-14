"use client";

import { useEffect } from "react";
import { CharacterImage } from "@/components/matches/CharacterImage";
import { characterLabel } from "@/lib/matches";
import type { PlayerCombatStatistics } from "@/lib/player-combat-statistics";

type Character = PlayerCombatStatistics["characters"][number];

type Props = {
  characters: Character[];
  selectedCharacterId: number | null;
  onSelect: (id: number) => void;
  onClose: () => void;
};

export function CharacterPickerModal({
  characters,
  selectedCharacterId,
  onSelect,
  onClose,
}: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="flex max-h-[min(88dvh,760px)] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-slate-600 bg-slate-900 shadow-[0_18px_48px_rgba(0,0,0,0.42)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="character-picker-title"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-700 px-4 py-3 sm:px-5">
          <div>
            <h2 id="character-picker-title" className="text-lg font-bold text-white">
              캐릭터 선택
            </h2>
            <p className="mt-1 text-xs text-slate-400">캐릭터를 선택해주세요.</p>
          </div>
          <button
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-600 bg-slate-950/80 text-lg text-white"
            type="button"
            aria-label="캐릭터 선택 닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="grid grid-cols-3 gap-2 overflow-y-auto p-3 sm:grid-cols-4 sm:gap-3 sm:p-4">
          {characters.map((character) => {
            const selected = selectedCharacterId === character.character_id;
            return (
              <button
                key={character.character_id}
                className={[
                  "flex min-w-0 flex-col items-stretch overflow-hidden rounded-xl border text-left transition-colors",
                  selected
                    ? "border-cyan-300 bg-cyan-400/10 ring-1 ring-cyan-300/50"
                    : "border-slate-700 bg-slate-800/70 hover:border-slate-500",
                ].join(" ")}
                type="button"
                aria-label={`${characterLabel(character.character_id)}, ${character.matches}전`}
                aria-pressed={selected}
                onClick={() => {
                  onSelect(character.character_id);
                  onClose();
                }}
              >
                <span className="block bg-slate-950/60 p-1.5 sm:p-2">
                  <CharacterImage
                    id={character.character_id}
                    width={200}
                    height={200}
                    sizes="(max-width: 640px) 28vw, 170px"
                    className="block aspect-square w-full [&>img]:h-full [&>img]:w-full [&>img]:object-contain"
                  />
                </span>
                <span className="flex min-w-0 items-center justify-between gap-1 px-2 py-1.5">
                  <span className="truncate text-[11px] font-semibold leading-tight text-slate-100 sm:text-xs">
                    {characterLabel(character.character_id)}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-400">
                    {character.matches}전
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
