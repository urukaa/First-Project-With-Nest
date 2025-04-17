// src/talent/talent.service.ts
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Role, StatusRegistration, Talent, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { R2Service } from 'src/common/r2.service';
import { ValidationService } from 'src/common/validation.service';
import { RegisterTalentReq, TalentResponse, UpdateRegisterTalentReq, UploadPhotoDisplayReq, VerificationTalentReq } from 'src/model/talent.model';
import { Logger } from 'winston';
import { TalentValidation } from './talent.validation';

@Injectable()
export class TalentService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly r2Service: R2Service,
    private validationService: ValidationService,
  ) {}

  toTalentResponse(talent: Talent): TalentResponse {
    return {
      id: talent.id,
      name: talent.name,
      sexs: talent.sexs,
      streaming_id: talent.streaming_id,
      birth_date: talent.birth_date,
      phone: talent.phone,
      tiktok_username: talent.tiktok_username,
      instagram_username: talent.instagram_username,
      host_location: talent.host_location,
      smartphone_used: talent.smartphone_used,
      referred_by: talent.referred_by,
      has_live_experience: talent.has_live_experience,
      photo_closeup: talent.photo_closeup,
      photo_fullbody: talent.photo_fullbody,
      photo_idcard: talent.photo_idcard,
      app_profile_screenshot: talent.app_profile_screenshot,
      introduction_video: talent.introduction_video,
      photo_display: talent.photo_display,
      livePlatformId: talent.live_platform_id,
      status: talent.status,
    };
  }

  async checkStatus(user: User): Promise<TalentResponse> {
    this.logger.info(`Check Status Talent ${JSON.stringify(user)}`);

    const existingSubmission = await this.prismaService.talent.findFirst({
      where: { user_id: user.id },
      include: { user: true },
    });

    if (!existingSubmission) {
      throw new HttpException('User has not registered as a Talent!', 200);
    }

    return this.toTalentResponse(existingSubmission);
  }

  async registerTalent(
    user: User,
    req: RegisterTalentReq,
    files: {
      photo_closeup: Express.Multer.File[];
      photo_fullbody: Express.Multer.File[];
      photo_idcard: Express.Multer.File[];
      app_profile_screenshot: Express.Multer.File[];
      introduction_video: Express.Multer.File[];
    },
  ) {
    this.logger.info(`Register Talent ${JSON.stringify(req)}`);

    const RegisterTalentRequest: RegisterTalentReq =
      this.validationService.validate(TalentValidation.REGISTER, req);

    const existingSubmission = await this.prismaService.talent.findFirst({
      where: { user_id: user.id },
    });

    if (existingSubmission) {
      throw new HttpException('User has upload submission', 400);
    }

    const existingLivePlatform =
      await this.prismaService.livePlatform.findUnique({
        where: { id: RegisterTalentRequest.live_platform_id },
      });

    if (!existingLivePlatform) {
      throw new HttpException('Live Platform not Found', 400);
    }

    const uploaded = {};
    for (const [key, value] of Object.entries(files)) {
      if (value && value[0]) {
        const { url } = await this.r2Service.uploadFile(value[0]);
        uploaded[key] = url;
      }
    }

    const newTalent = await this.prismaService.talent.create({
      data: {
        ...req,
        ...uploaded,
        birth_date: new Date(req.birth_date),
        user_id: user.id,
        live_platform_id: existingLivePlatform.id,
      },
    });

    return {
      message: 'Talent registered successfully',
      data: newTalent,
    };
  }

  async UpdateRegisterTalent(
    user: User,
    req: UpdateRegisterTalentReq,
    files: {
      photo_closeup?: Express.Multer.File[];
      photo_fullbody?: Express.Multer.File[];
      photo_idcard?: Express.Multer.File[];
      app_profile_screenshot?: Express.Multer.File[];
      introduction_video?: Express.Multer.File[];
    },
  ): Promise<TalentResponse> {
    this.logger.info(`Update Register Talent ${JSON.stringify(req)}`);

    const UpdateRegisterTalentRequest: UpdateRegisterTalentReq =
      this.validationService.validate(TalentValidation.UPDATE, req);

    const existingSubmission = await this.prismaService.talent.findFirst({
      where: { user_id: user.id },
    });

    if (!existingSubmission) {
      throw new HttpException('register required', 400);
    }

    if (existingSubmission.user_id !== user.id) {
      throw new HttpException('Forbidden', 403);
    }

    if (typeof req.birth_date === 'string') {
      req.birth_date = new Date(req.birth_date);
    }

    if (req.live_platform_id) {
      const existingLivePlatform =
        await this.prismaService.livePlatform.findUnique({
          where: { id: UpdateRegisterTalentRequest.live_platform_id },
        });

      if (!existingLivePlatform) {
        throw new HttpException('Live Platform not Found', 400);
      }
      req.live_platform_id = Number(req.live_platform_id);
    }

    const uploaded = {};
    for (const [key, value] of Object.entries(files)) {
      if (value && value[0]) {
        // Hapus media lama kalau ada
        const oldUrl = existingSubmission[key]; // ambil dari data lama
        if (oldUrl) {
          await this.r2Service.deleteFile(oldUrl); // pastikan method ini ada di r2Service
        }

        // Upload media baru
        const { url } = await this.r2Service.uploadFile(value[0]);
        uploaded[key] = url;
      }
    }

    const talent = await this.prismaService.talent.update({
      where: {
        user_id: existingSubmission.user_id,
      },
      data: {
        ...req,
        ...uploaded,
        user_id: user.id,
        status: StatusRegistration.PENDING,
      },
    });

    return this.toTalentResponse(talent);
  }

  async waitingList(status?: StatusRegistration): Promise<TalentResponse[]> {
    let talents = await this.prismaService.talent.findMany({
      include: { user: true },
    });

    if (status) {
      talents = await this.prismaService.talent.findMany({
        where: { status: status },
        include: { user: true },
      });
    }

    this.logger.debug(`Waiting List talent ${JSON.stringify(talents)}`);

    return talents.map((talent) => this.toTalentResponse(talent));
  }

  async VerificationTalent(
    req: VerificationTalentReq,
    talentId: number,
  ): Promise<TalentResponse> {
    this.logger.info(`Update Register Talent ${JSON.stringify(req)}`);

    const talent = await this.prismaService.talent.findFirst({
      where: { id: talentId },
      include: { user: true },
    });

    if (!talent) {
      throw new HttpException('data not found!', 400);
    }

    const VerificationTalentRequest: VerificationTalentReq =
      this.validationService.validate(TalentValidation.UPDATESTATUS, req);

    if (talent.status === StatusRegistration.ACCEPT) {
      await this.prismaService.user.update({
        where: { id: talent.user_id },
        data: {
          role: Role.USER,
        },
      });
    }

    await this.prismaService.talent.update({
      where: { id: talent.id },
      data: {
        status: VerificationTalentRequest.status,
      },
    });

    if (VerificationTalentRequest.status === StatusRegistration.ACCEPT) {
      await this.prismaService.user.update({
        where: { id: talent.user_id },
        data: {
          role: Role.TALENT,
        },
      });
    }

    return this.toTalentResponse(talent);
  }

  async uploadPhotoDisplay(
    talentId: number,
    files: {
      photo_display: Express.Multer.File[];
    },
  ) {
    this.logger.info(`Register Talent ${JSON.stringify(talentId)}`);

    const existingSubmission = await this.prismaService.talent.findFirst({
      where: { id: talentId },
    });

    if (!existingSubmission) {
      throw new HttpException('Talent Not Found!', 400);
    }

    const uploaded = {};
    for (const [key, value] of Object.entries(files)) {
      if (value && value[0]) {
        // Hapus media lama kalau ada
        const oldUrl = existingSubmission[key]; // ambil dari data lama
        if (oldUrl) {
          await this.r2Service.deleteFile(oldUrl);
        }

        // Upload media baru
        const { url } = await this.r2Service.uploadFile(value[0]);
        uploaded[key] = url;
      }
    }

    const talent = await this.prismaService.talent.update({
      where: {
        user_id: existingSubmission.user_id,
      },
      data:uploaded,
    });

    return this.toTalentResponse(talent);
  }
}
