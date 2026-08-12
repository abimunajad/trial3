import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="text-zinc-500 dark:text-zinc-400">
        Anggota tim tidak ditemukan, atau halaman ini tidak ada.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-black"
      >
        Kembali ke papan status
      </Link>
    </div>
  );
}
