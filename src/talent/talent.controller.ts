import { Controller, Post, Body, UploadedFiles, UseInterceptors, UseGuards, HttpCode, Get } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TalentService } from './talent.service';
import { RegisterTalentReq } from 'src/model/talent.model';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Registration Talent')
@Controller('/api/register-talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
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
      photo_closeup?: Express.Multer.File[];
      photo_fullbody?: Express.Multer.File[];
      photo_idcard?: Express.Multer.File[];
      app_profile_screenshot?: Express.Multer.File[];
      introduction_video?: Express.Multer.File[];
    },
  ) {

    return this.talentService.registerTalent(user, req, files);
  }
}
