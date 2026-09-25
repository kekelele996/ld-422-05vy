import { HAZARD_COLORS } from "../constants/hazardColors";
import type { HazardLevel } from "../types/enums";

export function formatHazardLevel(level: HazardLevel) {
  const icon = level === "Safe" ? "check" : level === "Flammable" ? "flame" : "warning";
  return { label: level, color: HAZARD_COLORS[level], icon };
}
