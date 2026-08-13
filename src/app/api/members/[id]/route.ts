import { NextResponse } from "next/server";
import { getMember, updateMember } from "@/lib/store";
import { isStatus } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) {
    return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ member });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const { status, task } = body as { status?: unknown; task?: unknown };

  if (!isStatus(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }
  if (typeof task !== "string") {
    return NextResponse.json({ error: "Tugas harus berupa teks" }, { status: 400 });
  }
  if (task.length > 500) {
    return NextResponse.json({ error: "Deskripsi tugas maksimal 500 karakter" }, { status: 400 });
  }

  const member = await updateMember(id, { status, task });
  if (!member) {
    return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ member });
}
