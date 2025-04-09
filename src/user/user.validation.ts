import { z, ZodType } from "zod"

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),

    email: z.string().email().min(1).max(100),

    phone: z.string().min(1).max(20),

    username: z.string().min(1).max(100),

    password: z.string().min(5).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
  });

  static readonly CHANGEPASSWORD: ZodType = z.object({
    oldPassword: z.string().min(5).max(100),
    newPassword: z.string().min(5).max(100),
  });
}