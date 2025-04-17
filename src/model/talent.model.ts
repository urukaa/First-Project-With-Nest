import { ApiProperty } from '@nestjs/swagger';
import { Sexs, StatusRegistration } from '@prisma/client';

export class TalentResponse {
  id?: number;
  name: string;
  sexs: Sexs;
  streaming_id: string;
  birth_date: Date;
  phone: string;
  tiktok_username: string;
  instagram_username: string;
  host_location: string;
  smartphone_used: string;
  referred_by: string;
  has_live_experience: string;
  photo_closeup: string;
  photo_fullbody: string;
  photo_idcard: string;
  app_profile_screenshot: string;
  introduction_video: string;
  photo_display: string | null;
  livePlatformId: number;
  status: string;
}

export class RegisterTalentReq {
  name: string;
  sexs: Sexs;
  streaming_id: string;
  birth_date: Date;
  phone: string;
  tiktok_username: string;
  instagram_username: string;
  host_location: string;
  smartphone_used: string;
  referred_by: string;
  has_live_experience: string;
  photo_closeup: string;
  photo_fullbody: string;
  photo_idcard: string;
  app_profile_screenshot: string;
  introduction_video: string;
  live_platform_id: number;
}

export class UpdateRegisterTalentReq {
  name?: string;
  sexs?: Sexs;
  streaming_id?: string;
  birth_date?: Date;
  phone?: string;
  tiktok_username?: string;
  instagram_username?: string;
  host_location?: string;
  smartphone_used?: string;
  referred_by?: string;
  has_live_experience?: string;
  photo_closeup?: string;
  photo_fullbody?: string;
  photo_idcard?: string;
  app_profile_screenshot?: string;
  introduction_video?: string;
  live_platform_id?: number;
}

export class VerificationTalentReq {
  @ApiProperty({ example: 'ACCEPT' })
  status: StatusRegistration;
}