import { Location, ContentBlock } from "../schemas/location";

let data: Location[] = [
  {
    id: "loc-1",
    campaignId: "demo-1",
    name: "Castle Ravenloft",
    tags: ["barovia", "stradhq"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [
      {
        id: "n1",
        title: "Overview",
        body: "The looming castle of Strahd.",
        audience: { role: "all" },
      },
      {
        id: "n2",
        title: "DM Secrets",
        body: "Hidden passages and traps.",
        audience: { role: "dm" },
      },
    ],
  },
];

// ✅ Return all locations for a given campaign
export async function listLocations(campaignId: string) {
  await new Promise((r) => setTimeout(r, 100));
  return data.filter((l) => l.campaignId === campaignId);
}

// ✅ Create a new location
export async function createLocation(input: {
  campaignId: string;
  name: string;
  tags?: string[];
}) {
  const loc: Location = {
    id: crypto.randomUUID(),
    campaignId: input.campaignId,
    name: input.name,
    tags: input.tags ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
  };
  data.push(loc);
  return loc;
}

// ✅ Add a note to a location
export async function addLocationNote(input: {
  locationId: string;
  note: ContentBlock;
}) {
  await new Promise((r) => setTimeout(r, 100));

  const loc = data.find((l) => l.id === input.locationId);
  if (!loc) throw new Error("Location not found");

  loc.notes.push(input.note);
  loc.updatedAt = new Date().toISOString();
  return input.note;
}
