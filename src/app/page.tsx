import Board from "@/components/Board";
import { getAllMembers } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const members = await getAllMembers();
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <Board initialMembers={members} />
    </div>
  );
}
