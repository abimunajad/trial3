export type Status = "belum_mulai" | "dikerjakan" | "selesai";

export const STATUSES: Status[] = ["belum_mulai", "dikerjakan", "selesai"];

export const STATUS_LABELS: Record<Status, string> = {
  belum_mulai: "Belum Mulai",
  dikerjakan: "Dikerjakan",
  selesai: "Selesai",
};

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as string[]).includes(value);
}

export type TeamMember = {
  id: string;
  name: string;
  status: Status;
  task: string;
};
