/**
 * Fixed roster for v1 — no add/remove-member feature.
 * Edit this list (and re-run `npm run seed` in production) to change the team.
 */
export type SeedMember = {
  id: string;
  name: string;
};

export const SEED_MEMBERS: SeedMember[] = [
  { id: "andi", name: "Andi" },
  { id: "budi", name: "Budi" },
  { id: "citra", name: "Citra" },
  { id: "dewi", name: "Dewi" },
  { id: "eka", name: "Eka" },
  { id: "fajar", name: "Fajar" },
  { id: "gita", name: "Gita" },
  { id: "hadi", name: "Hadi" },
];

export function findSeedMember(id: string): SeedMember | undefined {
  return SEED_MEMBERS.find((m) => m.id === id);
}
