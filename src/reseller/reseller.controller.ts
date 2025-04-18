import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResellerService } from "./reseller.service";
import { RegisterResellerReq, ResellerResponse, VerificationResellerReq } from "src/model/reseller.model";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { WebResponse } from "src/model/web.model";

@ApiTags('Registration Reseller')
@Controller('/api/register-reseller')
export class ResellerController {
  constructor(private resellerService: ResellerService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiBearerAuth()
  async checkStatus(@CurrentUser() user: User) {
    return this.resellerService.checkStatus(user);
  }

  @Post('/submission')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiBearerAuth()
  async createSubmission(
    @CurrentUser() user: User,
    @Body() req: RegisterResellerReq,
  ): Promise<{ message: string }> {
    await this.resellerService.RegisterReseller(user, req);
    return {
      message: 'Register Reseller Success!',
    };
  }

  @Patch('/submission/update')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiBearerAuth()
  async updateSubmission(
    @CurrentUser() user: User,
    @Body() req: RegisterResellerReq,
  ): Promise<{ message: string }> {
    await this.resellerService.UpdateRegisterReseller(user, req);
    return {
      message: 'Update Submission Register Reseller Success!',
    };
  }

  @Get('/submission/list')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async listSubmission(): Promise<WebResponse<ResellerResponse[]>> {
    const result = await this.resellerService.waitingList();
    return {
      data: result,
    };
  }

  @Patch('/submission/verification/:resellerId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async verificationSubmission(
    @Param('resellerId', ParseIntPipe) resellerId: number,
    @Body() req: VerificationResellerReq,
  ): Promise<{ message: string }> {
    await this.resellerService.VerificationReseller(req);
    return {
      message: 'Verification Reseller Success!',
    };
  }
}
