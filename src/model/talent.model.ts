import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sexs, StatusRegistration } from '@prisma/client';
import { optional } from 'zod';

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
  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiProperty({ enum: Sexs })
  sexs: Sexs;

  @ApiProperty({ example: 'streaming_id123' })
  streaming_id: string;

  @ApiProperty({ example: '2001-04-12', type: String, format: 'date' })
  birth_date: Date;

  @ApiProperty({ example: '08123456789' })
  phone: string;

  @ApiProperty({ example: 'tiktok_jane' })
  tiktok_username: string;

  @ApiProperty({ example: 'ig_jane' })
  instagram_username: string;

  @ApiProperty({ example: 'Jakarta' })
  host_location: string;

  @ApiProperty({ example: 'iPhone 14' })
  smartphone_used: string;

  @ApiProperty({ example: 'teman' })
  referred_by: string;

  @ApiProperty({ example: 'yes' })
  has_live_experience: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  photo_closeup: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  photo_fullbody: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  photo_idcard: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  app_profile_screenshot: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  introduction_video: any;

  @ApiProperty({ example: 1 })
  live_platform_id: number;
}

export class UpdateRegisterTalentReq {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  name?: string;

  @ApiPropertyOptional({ enum: Sexs })
  sexs?: Sexs;

  @ApiPropertyOptional({ example: 'streaming_id123' })
  streaming_id?: string;

  @ApiPropertyOptional({ example: '2001-04-12', type: String, format: 'date' })
  birth_date?: Date;

  @ApiPropertyOptional({ example: '08123456789' })
  phone?: string;

  @ApiPropertyOptional({ example: 'tiktok_jane' })
  tiktok_username?: string;

  @ApiPropertyOptional({ example: 'ig_jane' })
  instagram_username?: string;

  @ApiPropertyOptional({ example: 'Jakarta' })
  host_location?: string;

  @ApiPropertyOptional({ example: 'iPhone 14' })
  smartphone_used?: string;

  @ApiPropertyOptional({ example: 'teman' })
  referred_by?: string;

  @ApiPropertyOptional({ example: 'yes' })
  has_live_experience?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  photo_closeup?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  photo_fullbody?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  photo_idcard?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  app_profile_screenshot?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  introduction_video?: any;

  @ApiPropertyOptional({ example: 1 })
  live_platform_id?: number;
}

export class VerificationTalentReq {
  @ApiProperty({ example: 'ACCEPT' })
  status: StatusRegistration;
}

export class UploadPhotoDisplayReq {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  photo_display: string;
}