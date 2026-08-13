import { Redis } from "@upstash/redis";
import { SEED_MEMBERS } from "./members";
import type { Status, TeamMember } from "./types";

type MemberState = {
  status: Status;
  task: string;
};

const DEFAULT_STATE: MemberState = { status: "belum_mulai", task: "" };

function redisKey(id: string) {
  return `team-status-board:member:${id}`;
}

// Vercel's Redis marketplace integration (Upstash-backed) exposes either
// UPSTASH_REDIS_REST_* or KV_REST_API_* depending on how it was connected.
const REST_URL =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REST_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis =
  REST_URL && REST_TOKEN
    ? new Redis({ url: REST_URL, token: REST_TOKEN })
    : null;

// In-memory fallback so `npm run dev` works with zero setup. Not persisted
// across process restarts — fine for local development only.
//
// Stashed on `globalThis` because Next.js (Turbopack) compiles route
// handlers and pages into separate module graphs in dev mode; a plain
// module-level singleton would end up duplicated instead of shared.
const globalForStore = globalThis as unknown as {
  __teamStatusBoardMemory?: Map<string, MemberState>;
};
const memoryStore =
  globalForStore.__teamStatusBoardMemory ?? new Map<string, MemberState>();
globalForStore.__teamStatusBoardMemory = memoryStore;

function memoryDefaults() {
  if (memoryStore.size === 0) {
    for (const member of SEED_MEMBERS) {
      memoryStore.set(member.id, { ...DEFAULT_STATE });
    }
  }
}

export function isUsingRedis() {
  return redis !== null;
}

async function readState(id: string): Promise<MemberState> {
  if (redis) {
    const state = await redis.hgetall<MemberState>(redisKey(id));
    if (state && state.status) return state;
    return { ...DEFAULT_STATE };
  }
  memoryDefaults();
  return memoryStore.get(id) ?? { ...DEFAULT_STATE };
}

async function writeState(id: string, state: MemberState): Promise<void> {
  if (redis) {
    await redis.hset(redisKey(id), state);
    return;
  }
  memoryDefaults();
  memoryStore.set(id, state);
}

export async function getAllMembers(): Promise<TeamMember[]> {
  const states = await Promise.all(
    SEED_MEMBERS.map((member) => readState(member.id))
  );
  return SEED_MEMBERS.map((member, i) => ({
    id: member.id,
    name: member.name,
    ...states[i],
  }));
}

export async function getMember(id: string): Promise<TeamMember | null> {
  const seed = SEED_MEMBERS.find((m) => m.id === id);
  if (!seed) return null;
  const state = await readState(id);
  return { id: seed.id, name: seed.name, ...state };
}

export async function updateMember(
  id: string,
  update: { status: Status; task: string }
): Promise<TeamMember | null> {
  const seed = SEED_MEMBERS.find((m) => m.id === id);
  if (!seed) return null;
  const state: MemberState = { status: update.status, task: update.task };
  await writeState(id, state);
  return { id: seed.id, name: seed.name, ...state };
}

export async function seedDefaults(): Promise<void> {
  for (const member of SEED_MEMBERS) {
    if (redis) {
      const existing = await redis.hgetall<MemberState>(redisKey(member.id));
      if (existing && existing.status) continue;
      await redis.hset(redisKey(member.id), DEFAULT_STATE);
    } else {
      memoryDefaults();
      if (!memoryStore.has(member.id)) {
        memoryStore.set(member.id, { ...DEFAULT_STATE });
      }
    }
  }
}
