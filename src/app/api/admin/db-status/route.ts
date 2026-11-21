import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function GET() {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({
      configured: false,
      connected: false,
      provider: "In-Memory DataStore (Fallback)",
      message: "Supabase environment variables not detected. Using local in-memory storage.",
    });
  }

  const start = Date.now();
  try {
    const { count, error } = await supabase
      .from("parrots")
      .select("id", { count: "exact", head: true });

    const latencyMs = Date.now() - start;

    if (error) {
      return NextResponse.json({
        configured: true,
        connected: false,
        provider: "Supabase (Error)",
        error: error.message,
        hint: "Make sure you ran the SQL schema query in Supabase SQL Editor.",
        latencyMs,
      });
    }

    return NextResponse.json({
      configured: true,
      connected: true,
      provider: "Supabase (PostgreSQL)",
      message: "Successfully connected to Supabase PostgreSQL database!",
      parrotCount: count ?? 0,
      latencyMs,
    });
  } catch (err) {
    return NextResponse.json({
      configured: true,
      connected: false,
      provider: "Supabase (Connection Failed)",
      error: err instanceof Error ? err.message : String(err),
      latencyMs: Date.now() - start,
    });
  }
}
