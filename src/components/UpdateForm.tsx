"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES, STATUS_LABELS, type Status, type TeamMember } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function UpdateForm({ member }: { member: TeamMember }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(member.status);
  const [task, setTask] = useState(member.task);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveState("saving");
    setErrorMessage("");
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, task }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setSaveState("saved");
      router.refresh();
    } catch (err) {
      setSaveState("error");
      setErrorMessage(err instanceof Error ? err.message : "Gagal menyimpan");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Status kerja
        </legend>
        <div className="flex flex-col gap-2 sm:flex-row">
          {STATUSES.map((s) => (
            <label
              key={s}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-base font-medium transition-colors ${
                status === s
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <input
                type="radio"
                name="status"
                value={s}
                checked={status === s}
                onChange={() => setStatus(s)}
                className="sr-only"
              />
              {STATUS_LABELS[s]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Deskripsi tugas (opsional)
        </span>
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Contoh: Menyelesaikan revisi desain landing page"
          className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-white"
        />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saveState === "saving"}
          className="rounded-xl bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {saveState === "saving" ? "Menyimpan..." : "Simpan Status"}
        </button>
        {saveState === "saved" && (
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Tersimpan
          </span>
        )}
        {saveState === "error" && (
          <span className="text-sm font-medium text-red-500">{errorMessage}</span>
        )}
      </div>
    </form>
  );
}
