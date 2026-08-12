import { NextResponse } from "next/server";
import { getAllMembers } from "@/lib/store";

export async function GET() {
  const members = await getAllMembers();
  return NextResponse.json({ members });
}
