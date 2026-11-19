import { NextResponse } from "next/server";
import { getHomepageSlots, updateHomepageSlot } from "@/lib/dataStore";
import { HomepageSlot } from "@/lib/types";

export async function GET() {
  const slots = await getHomepageSlots();
  return NextResponse.json(slots);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slotKey, title, subtitle, imageUrl, ctaText, ctaLink } = body;

    if (!slotKey) {
      return NextResponse.json({ error: "slotKey is required" }, { status: 400 });
    }

    const updated = await updateHomepageSlot(slotKey as HomepageSlot["slotKey"], {
      title,
      subtitle,
      imageUrl,
      ctaText,
      ctaLink,
    });

    if (!updated) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update homepage slot" }, { status: 500 });
  }
}
