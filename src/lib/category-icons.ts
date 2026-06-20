import type { UMKMCategory } from "./types";

/**
 * Map UMKM category → custom brand icon PNG path.
 * Files live in /public/cat-*.png (auto-generated from uploaded brand icons).
 *
 * Used in: Marketplace card, Marketplace category filter, Onboarding dropdown,
 *          Owner Dashboard, DAO Jury, Investor Dashboard, Secondary Market.
 */
export function categoryIconPath(category: UMKMCategory): string {
  return `/cat-${category}.png`;
}

/**
 * Default gradient backgrounds per category (kept for fallback styling
 * on cards where icon sits on a colored cover).
 */
export const CATEGORY_GRADIENTS: Record<UMKMCategory, string> = {
  kuliner: "from-amber-200 via-orange-300 to-rose-300",
  kopi: "from-amber-200 via-orange-300 to-rose-300",
  laundry: "from-teal-200 via-cyan-300 to-emerald-300",
  kerajinan: "from-lime-200 via-green-300 to-emerald-300",
  jasa: "from-sky-200 via-blue-300 to-indigo-300",
  pertanian: "from-emerald-200 via-teal-300 to-green-300",
};
