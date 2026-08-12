import Link from "next/link";
import { notFound } from "next/navigation";
import UpdateForm from "@/components/UpdateForm";
import { getMember } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getMember(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-10 dark:bg-black sm:py-16">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Kembali ke papan status
        </Link>
        <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Update Status — {member.name}
        </h1>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          Perubahan langsung tampil di papan status utama untuk semua orang.
        </p>
        <UpdateForm member={member} />
      </div>
    </div>
  );
}
