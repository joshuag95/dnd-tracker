import { z } from "zod";

export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  system: z.string().default("5e"),
  createdAt: z.string(), // ISO date
});

export type Campaign = z.infer<typeof CampaignSchema>;
