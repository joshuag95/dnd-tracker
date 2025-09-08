import { NextResponse } from "next/server";
import { z } from "zod";
import { listCampaigns, createCampaign } from "@/lib/dal/campaigns.memory";


export async function GET() {
  const items = await listCampaigns();
  return NextResponse.json(items);
}

const CreateBody = z.object({
  name: z.string().min(1),
  system: z.string().optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const created = await createCampaign(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
