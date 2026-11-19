import { NextResponse } from "next/server";
import { getParrots, addParrot } from "@/lib/dataStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const species = searchParams.get("species");
  const status = searchParams.get("status");

  let parrots = await getParrots();

  if (featured === "true") {
    parrots = parrots.filter((p) => p.featuredOnHome);
  }
  if (species && species !== "All") {
    parrots = parrots.filter((p) => p.species.toLowerCase() === species.toLowerCase());
  }
  if (status && status !== "All") {
    parrots = parrots.filter((p) => p.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json(parrots);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.species) {
      return NextResponse.json({ error: "Name and species are required" }, { status: 400 });
    }

    const newParrot = await addParrot({
      name: body.name,
      species: body.species,
      age: body.age || "Unknown",
      gender: body.gender || "Unknown",
      status: body.status || "Available",
      description: body.description || "",
      personality: Array.isArray(body.personality) ? body.personality : [],
      imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1000&q=80",
      featuredOnHome: Boolean(body.featuredOnHome),
      healthStatus: body.healthStatus,
      diet: body.diet,
      lifespan: body.lifespan,
    });

    return NextResponse.json(newParrot, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create parrot record" }, { status: 500 });
  }
}
