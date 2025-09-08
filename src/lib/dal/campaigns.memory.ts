import { Campaign } from "../schemas/campaign";

let data: Campaign[] = [
  {
    id: "demo-1",
    name: "Curse of Strahd",
    system: "5e",
    createdAt: new Date().toISOString(),
  },
];

// In-memory DAL for MVP without a DB
export async function listCampaigns(): Promise<Campaign[]> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 120));
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
}

export async function createCampaign(input: { name: string; system?: string }) {
  const c: Campaign = {
    id: crypto.randomUUID(),
    name: input.name,
    system: input.system ?? "5e",
    createdAt: new Date().toISOString(),
  };
  data.push(c);
  return c;
}
