import { z, ZodType } from 'zod';

export enum Sexs {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class TalentValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(2),
    sexs: z.nativeEnum(Sexs),
    streaming_id: z.string().min(3),
    birth_date: z.coerce.date(),
    phone: z.string().min(10).max(15),
    tiktok_username: z.string(),
    instagram_username: z.string(),
    host_location: z.string(),
    smartphone_used: z.string(),
    referred_by: z.string(),
    has_live_experience: z.string(),

    // File uploads (akan diubah jadi URL string setelah upload ke R2)
    photo_closeup: z.string().url().optional(),
    photo_fullbody: z.string().url().optional(),
    photo_idcard: z.string().url().optional(),
    app_profile_screenshot: z.string().url().optional(),
    introduction_video: z.string().url().optional(),

    live_platform_id: z.preprocess((val) => Number(val), z.number().int()),
  });
}
