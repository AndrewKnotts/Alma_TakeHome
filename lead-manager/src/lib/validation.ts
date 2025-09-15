import { z } from "zod";

export const VISA_OPTIONS = ["O-1", "EB-1A", "EB-2 NIW", "I don't know"] as const;

export const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  country: z.string().min(1, "Country is required"),
  linkedin: z.string().url("Valid URL required").includes("linkedin.", { message: "Must be a LinkedIn URL" }),
  visas: z.array(z.enum(VISA_OPTIONS)).min(1, "Please select at least one category of visa."),
  notes: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
