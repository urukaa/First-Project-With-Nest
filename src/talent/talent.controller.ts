import { Controller, Post, Body, UploadedFiles, UseInterceptors, UseGuards, HttpCode, Get, Patch, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TalentService } from './talent.service';
import { RegisterTalentReq, TalentResponse, UpdateRegisterTalentReq, UploadPhotoDisplayReq, VerificationTalentReq } from 'src/model/talent.model';
import { StatusRegistration, User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WebResponse } from 'src/model/web.model';

@ApiTags('Registration Talent')
@Controller('/api/register-talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'TALENT')
  @ApiBearerAuth()
  async checkStatus(@CurrentUser() user: User) {
    return this.talentService.checkStatus(user);
  }

  @Post('/submission')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo_closeup', maxCount: 1 },
      { name: 'photo_fullbody', maxCount: 1 },
      { name: 'photo_idcard', maxCount: 1 },
      { name: 'app_profile_screenshot', maxCount: 1 },
      { name: 'introduction_video', maxCount: 1 },
    ]),
  )
  async registerTalent(
    @CurrentUser() user: User,
    @Body() req: RegisterTalentReq,
    @UploadedFiles()
    files: {
      photo_closeup: Express.Multer.File[];
      photo_fullbody: Express.Multer.File[];
      photo_idcard: Express.Multer.File[];
      app_profile_screenshot: Express.Multer.File[];
      introduction_video: Express.Multer.File[];
    },
  ) {
    return this.talentService.registerTalent(user, req, files);
  }

  @Patch('/submission/update')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo_closeup', maxCount: 1 },
      { name: 'photo_fullbody', maxCount: 1 },
      { name: 'photo_idcard', maxCount: 1 },
      { name: 'app_profile_screenshot', maxCount: 1 },
      { name: 'introduction_video', maxCount: 1 },
    ]),
  )
  async updateSubmission(
    @CurrentUser() user: User,
    @Body() req: UpdateRegisterTalentReq,
    @UploadedFiles()
    files: {
      photo_closeup?: Express.Multer.File[];
      photo_fullbody?: Express.Multer.File[];
      photo_idcard?: Express.Multer.File[];
      app_profile_screenshot?: Express.Multer.File[];
      introduction_video?: Express.Multer.File[];
    },
  ): Promise<{ message: string }> {
    await this.talentService.UpdateRegisterTalent(user, req, files);
    return {
      message: 'Update Submission Register Talent Success!',
    };
  }

  @Get('/submission/list')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'status',
    enum: StatusRegistration,
    required: false, // ← agar tidak wajib di Swagger
    description: 'Filter berdasarkan status pendaftaran',
  })
  async listSubmission(
    @Query('status') status?: StatusRegistration,
  ): Promise<WebResponse<TalentResponse[]>> {
    const result = await this.talentService.waitingList(status);
    return {
      data: result,
    };
  }

  @Patch('/submission/verification/:talentId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async verificationSubmission(
    @Param('talentId', ParseIntPipe) talentId: number,
    @Body() req: VerificationTalentReq,
  ): Promise<{ message: string }> {
    await this.talentService.VerificationTalent(req, talentId);
    return {
      message: 'Verification talent Success!',
    };
  }

  @Patch('/upload/photo-display/:talentId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo_display', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload photo display',
    type: UploadPhotoDisplayReq,
  })
  async uploadPhotoDisplay(
    @Param('talentId', ParseIntPipe) talentId: number,
    @UploadedFiles()
    files: {
      photo_display: Express.Multer.File[];
    },
  ): Promise<{ message: string }> {
    await this.talentService.uploadPhotoDisplay(talentId, files);
    return {
      message: 'Upload Photo Display Success!',
    };
  }
}
