import { z, ZodType } from "zod";

export class ResellerValidation {
  static readonly REGISTER: ZodType = z.object({
    phone: z.string().min(10).max(15),
  });

  static readonly UPDATESTATUS: ZodType = z.object({
    status: z.string(),
  });
}