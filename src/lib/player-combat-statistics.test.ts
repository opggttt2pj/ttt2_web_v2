import { describe, expect, it } from "vitest";
import { parsePlayerCombatStatistics } from "@/lib/player-combat-statistics";

function metrics() {
  return {
    throw_count: 2,
    thrown_count: 1,
    dodged_throw_count: 1,
    throw_dodged_count: 1,
    team_throw_attempts: 12,
    team_throw_success_count: 7,
    low_blow_count: 1,
    low_blowed_count: 0,
    dodged_low_blow_count: 1,
    low_blow_dodged_count: 0,
    counter_attack_count: 1,
    counter_attacked_count: 1,
    tag_assault_count: 1,
    tag_combo_count: 1,
    combo_hit_plain: 2,
    combo_hit_wall: 1,
    combo_hit_gimmick: 1,
    combo_hit_plain_max: 9,
    combo_hit_gimmick_max: 3,
    combo_hit_plain_avg: 4.5,
    combo_hit_gimmick_avg: 1.5,
    tag_assault_avg: 0.5,
    tag_combo_avg: 0.5,
    team_throw_success_rate: 58.3,
    throw_defense_rate: 50,
    low_blow_success_rate: 100,
    low_blow_defense_rate: 100,
  };
}

function payload() {
  return {
    name: "Player",
    summary: { matches: 4, wins: 3, rate: 75, stats_matches: 2 },
    overall: metrics(),
    character_count: 1,
    characters_truncated: false,
    characters: [
      {
        character_id: 4,
        matches: 2,
        wins: 2,
        rate: 100,
        main_uses: 2,
        sub_uses: 0,
        stats: metrics(),
      },
    ],
  };
}

describe("parsePlayerCombatStatistics", () => {
  it("parses totals, stat coverage, and per-character values", () => {
    const result = parsePlayerCombatStatistics(payload());

    expect(result.summary).toEqual({
      matches: 4,
      wins: 3,
      rate: 75,
      stats_matches: 2,
    });
    expect(result.overall.team_throw_success_rate).toBe(58.3);
    expect(result.characters[0]).toMatchObject({
      character_id: 4,
      matches: 2,
      main_uses: 2,
      sub_uses: 0,
    });
  });

  it("rejects an impossible stat coverage count", () => {
    const invalid = payload();
    invalid.summary.stats_matches = 5;

    expect(() => parsePlayerCombatStatistics(invalid)).toThrow(
      "경기 수가 올바르지 않습니다",
    );
  });

  it("rejects duplicate character rows", () => {
    const invalid = payload();
    invalid.character_count = 2;
    invalid.characters.push({
      ...invalid.characters[0],
      sub_uses: 1,
    });

    expect(() => parsePlayerCombatStatistics(invalid)).toThrow(
      "중복 캐릭터",
    );
  });

  it("parses per-match average and max combo/tag values", () => {
    const result = parsePlayerCombatStatistics(payload());

    expect(result.overall.combo_hit_plain_max).toBe(9);
    expect(result.overall.combo_hit_gimmick_max).toBe(3);
    expect(result.overall.combo_hit_plain_avg).toBe(4.5);
    expect(result.overall.tag_assault_avg).toBe(0.5);
    expect(result.characters[0].stats.combo_hit_gimmick_avg).toBe(1.5);
  });

  it("treats missing average and max fields as null", () => {
    const legacy = payload();
    const legacyMetrics = { ...legacy.overall } as Record<string, unknown>;
    delete legacyMetrics.combo_hit_plain_max;
    delete legacyMetrics.combo_hit_gimmick_max;
    delete legacyMetrics.combo_hit_plain_avg;
    delete legacyMetrics.combo_hit_gimmick_avg;
    delete legacyMetrics.tag_assault_avg;
    delete legacyMetrics.tag_combo_avg;
    legacy.overall = legacyMetrics as typeof legacy.overall;

    const result = parsePlayerCombatStatistics(legacy);

    expect(result.overall.combo_hit_plain_max).toBeNull();
    expect(result.overall.combo_hit_plain_avg).toBeNull();
    expect(result.overall.tag_assault_avg).toBeNull();
  });
});
