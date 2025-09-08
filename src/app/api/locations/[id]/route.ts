import { NextResponse } from "next/server";
import { listLocations } from "@/lib/dal/locations.memory";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const all = await listLocations("demo-1"); // hardcoded campaign for now
  const loc = all.find((l) => l.id === id);

  if (!loc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(loc);
}
