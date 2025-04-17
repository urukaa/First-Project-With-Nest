import { z, ZodType } from "zod";

export class LivePlatformValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(50),
    coin_type: z.string().min(1).max(50),
    price_per_coin: z.number().positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(50).optional(),
    coin_type: z.string().min(1).max(50).optional(),
    price_per_coin: z.number().positive().optional(),
  });
}