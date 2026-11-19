import { NextResponse } from "next/server";
import { getParrotById, updateParrot, deleteParrot } from "@/lib/dataStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parrot = await getParrotById(id);
  if (!parrot) {
    return NextResponse.json({ error: "Parrot not found" }, { status: 404 });
  }
  return NextResponse.json(parrot);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateParrot(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Parrot not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update parrot" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteParrot(id);
  if (!deleted) {
    return NextResponse.json({ error: "Parrot not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, id });
}
