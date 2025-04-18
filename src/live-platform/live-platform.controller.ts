import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { LivePlatformService } from "./live-platform.service";
import { ApiBearerAuth, ApiExcludeEndpoint } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { WebResponse } from "src/model/web.model";
import { LivePlatformReq, LivePlatformResponse, UpdateLivePlatformReq } from "src/model/live-platform.model";

@Controller('/api/live-platform')
export class LivePlatformController {
  constructor(private livePlatformService: LivePlatformService) {}

  @Get('/list')
  @HttpCode(200)
  async listSubmission(): Promise<WebResponse<LivePlatformResponse[]>> {
    const result = await this.livePlatformService.livePlatformList();
    return {
      data: result,
    };
  }

  @Post('/create')
  @HttpCode(200)
  @ApiExcludeEndpoint() // to hidden
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async createSubmission(
    @Body() req: LivePlatformReq,
  ): Promise<{ message: string }> {
    await this.livePlatformService.createLivePlatform(req);
    return {
      message: 'Create Live Platform Success!',
    };
  }

  @Patch('/update/:livePlatformId')
  @HttpCode(200)
  @ApiExcludeEndpoint() // to hidden
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async verificationSubmission(
    @Param('livePlatformId', ParseIntPipe) livePlatformId: number,
    @Body() req: UpdateLivePlatformReq,
  ): Promise<{ message: string }> {
    await this.livePlatformService.updateLivePlatform(livePlatformId, req);
    return {
      message: 'Live Platfrom Update Success!',
    };
  }
}