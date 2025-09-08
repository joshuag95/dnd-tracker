import { z } from "zod";

export const AudienceSchema = z.union([
  z.object({ role: z.literal("dm") }),
  z.object({ role: z.literal("all") }),
  z.object({ role: z.literal("pc"), pcId: z.string().optional() }),
]);
export type Audience = z.infer<typeof AudienceSchema>;

export const ContentBlockSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  body: z.string(),
  audience: AudienceSchema,
});
export type ContentBlock = z.infer<typeof ContentBlockSchema>;

export const LocationSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  name: z.string().min(1),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  notes: z.array(ContentBlockSchema),
});
export type Location = z.infer<typeof LocationSchema>;
