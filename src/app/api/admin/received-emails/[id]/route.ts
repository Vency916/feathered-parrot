import { NextResponse } from "next/server";
import { updateReceivedEmailStatus, deleteReceivedEmail } from "@/lib/dataStore";
import { ReceivedEmail } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: ReceivedEmail["status"] };

    if (!status || !["Unread", "Read", "Replied"].includes(status)) {
      return NextResponse.json({ error: "Valid status is required" }, { status: 400 });
    }

    const updated = await updateReceivedEmailStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, email: updated });
  } catch (error) {
    console.error("Failed to update received email:", error);
    return NextResponse.json({ error: "Failed to update email status" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteReceivedEmail(id);
    if (!success) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Email deleted" });
  } catch (error) {
    console.error("Failed to delete received email:", error);
    return NextResponse.json({ error: "Failed to delete email" }, { status: 500 });
  }
}
