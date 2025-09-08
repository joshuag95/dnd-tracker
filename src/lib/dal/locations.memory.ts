import { Location } from "../schemas/location";

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

// ✅ notice both functions are exported
export async function listLocations(campaignId: string) {
  await new Promise((r) => setTimeout(r, 100));
  return data.filter((l) => l.campaignId === campaignId);
}

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
