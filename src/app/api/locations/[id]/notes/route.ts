import { NextResponse } from "next/server";
import { z } from "zod";
import { addLocationNote } from "@/lib/dal/locations.memory";
import { AudienceSchema } from "@/lib/schemas/location";

// Validate the incoming body
const CreateNoteBody = z.object({
  title: z.string().optional(),
  body: z.string().min(1, "Body is required"),
  audience: AudienceSchema, // { role: "dm" } | { role:"all" } | { role:"pc", pcId? }
});

// POST /api/locations/:id/notes
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const locationId = params.id;
  if (!locationId) {
    return NextResponse.json({ error: "Missing location id" }, { status: 400 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = CreateNoteBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", detail: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const note = {
    id: crypto.randomUUID(),
    title: parsed.data.title,
    body: parsed.data.body,
    audience: parsed.data.audience,
  };

  const created = await addLocationNote({ locationId, note });
  return NextResponse.json(created, { status: 201 });
}
