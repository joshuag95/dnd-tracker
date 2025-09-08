import { NextResponse } from "next/server";
import { z } from "zod";
import { listLocations, createLocation } from "@/lib/dal/locations.memory";

const CreateBody = z.object({
  campaignId: z.string(),
  name: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

// GET /api/locations
export async function GET(req: Request) {
  // For MVP, hardcode demo campaign ID
  const demoCampaignId = "demo-1";
  const items = await listLocations(demoCampaignId);
  return NextResponse.json(items);
}

// POST /api/locations
export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = CreateBody.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const created = await createLocation(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
