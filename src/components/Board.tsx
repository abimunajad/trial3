"use client";

import { useEffect, useRef, useState } from "react";
import StatusBadge from "./StatusBadge";
import type { TeamMember } from "@/lib/types";

const POLL_INTERVAL_MS = 7000;

export default function Board({
  initialMembers,
}: {
  initialMembers: TeamMember[];
}) {
  const [members, setMembers] = useState(initialMembers);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isOffline, setIsOffline] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/members", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setMembers(data.members);
          setLastUpdated(new Date());
          setIsOffline(false);
        }
      } catch {
        if (!cancelled) setIsOffline(true);
      } finally {
        if (!cancelled) {
          timeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        }
      }
    }

    timeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-col gap-1 border-b border-zinc-200 px-6 py-6 dark:border-zinc-800 sm:px-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Status Tim
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {isOffline ? (
            <span className="text-red-500">
              Gagal memuat data terbaru — mencoba lagi...
            </span>
          ) : (
            <>
              Diperbarui otomatis · terakhir{" "}
              {lastUpdated.toLocaleTimeString("id-ID")}
            </>
          )}
        </p>
      </header>

      <main className="flex-1 px-6 py-8 sm:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold sm:text-2xl">
                  {member.name}
                </h2>
                <StatusBadge status={member.status} />
              </div>
              <p className="min-h-[1.75rem] text-base text-zinc-600 dark:text-zinc-300 sm:text-lg">
                {member.task || (
                  <span className="italic text-zinc-400 dark:text-zinc-500">
                    Belum ada deskripsi tugas
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
