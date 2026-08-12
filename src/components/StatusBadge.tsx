import { STATUS_LABELS, type Status } from "@/lib/types";

const STYLES: Record<Status, string> = {
  belum_mulai: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200",
  dikerjakan: "bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-200",
  selesai: "bg-emerald-200 text-emerald-900 dark:bg-emerald-500/30 dark:text-emerald-200",
};

const DOT_STYLES: Record<Status, string> = {
  belum_mulai: "bg-zinc-500",
  dikerjakan: "bg-amber-500",
  selesai: "bg-emerald-500",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-base font-semibold sm:text-lg ${STYLES[status]}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${DOT_STYLES[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
