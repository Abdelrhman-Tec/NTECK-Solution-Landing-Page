import { z } from "zod";

export const customerTypes = ["founder", "entrepreneur", "business", "other"] as const;
export const projectTypes = ["mobile", "mvp", "saas", "web", "api", "existing", "consulting", "other"] as const;
export const stages = ["idea", "planning", "prototype", "live"] as const;

export const fieldLimits = {
  name: 100,
  email: 254,
  country: 100,
  whatsapp: 16,
  company: 120,
  budget: 100,
  timeline: 100,
  description: 2400,
} as const;

const line = (max: number, min = 1) =>
  z.string().trim().min(min).max(max).regex(/^[^\p{Cc}\p{Zl}\p{Zp}]*$/u);
const optionalLine = (max: number) => line(max, 0).optional();

export const inquirySchema = z.strictObject({
  name: line(fieldLimits.name, 2),
  email: line(fieldLimits.email).pipe(z.email()),
  country: line(fieldLimits.country, 2),
  customerType: z.enum(customerTypes),
  projectType: z.enum(projectTypes),
  description: z.string().trim().min(20).max(fieldLimits.description)
    .regex(/^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]*$/u)
    .transform((value) => value.replace(/\r\n?/g, "\n")),
  consent: z.boolean().refine(Boolean),
  whatsapp: z.string().trim().max(fieldLimits.whatsapp)
    .regex(/^(?:\+[1-9]\d{6,14})?$/).optional(),
  company: optionalLine(fieldLimits.company),
  stage: z.union([z.enum(stages), z.literal("")]).optional(),
  budget: optionalLine(fieldLimits.budget),
  timeline: optionalLine(fieldLimits.timeline),
  website: z.string().max(200).optional(),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

export type InquiryResult =
  | "accepted"
  | "invalid"
  | "unavailable"
  | "rateLimited"
  | "failed";
