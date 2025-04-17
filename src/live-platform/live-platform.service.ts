import { HttpException, Inject, Injectable } from "@nestjs/common";
import { LivePlatform } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/common/prisma.service";
import { ValidationService } from "src/common/validation.service";
import { LivePlatformReq, LivePlatformResponse, UpdateLivePlatformReq } from "src/model/live-platform.model";
import { Logger } from "winston";
import { LivePlatformValidation } from "./live-platform.validation";

@Injectable()
export class LivePlatformService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly PrismaService: PrismaService,
    private ValidationService: ValidationService,
  ) {}

  toLivePlatformResponse(livePlatform: LivePlatform): LivePlatformResponse {
    return {
      id: livePlatform.id,
      name: livePlatform.name,
      coin_type: livePlatform.coin_type,
      price_per_coin: livePlatform.price_per_coin,
    };
  }

  async createLivePlatform(
    req: LivePlatformReq,
  ): Promise<LivePlatformResponse> {
    this.logger.info(`Create Live Platform ${JSON.stringify(req)}`);

    const LivePlatformRequest: LivePlatformReq =
      this.ValidationService.validate(LivePlatformValidation.CREATE, req);

    const existingPlatform = await this.PrismaService.livePlatform.findFirst({
      where: { name: req.name },
    });

    if (existingPlatform) {
      throw new HttpException('Live Platform Already Exist!', 400);
    }

     LivePlatformRequest.name = LivePlatformRequest.name.toUpperCase();

    const newLivePlatform = await this.PrismaService.livePlatform.create({
      data: LivePlatformRequest,
    });

    return this.toLivePlatformResponse(newLivePlatform);
  }

  async updateLivePlatform(
    livePlatformId: number,
    req: UpdateLivePlatformReq,
  ): Promise<LivePlatformResponse> {
    this.logger.info(`Create Live Platform ${JSON.stringify(req)}`);

    const UpdateLivePlatformRequest: UpdateLivePlatformReq =
      this.ValidationService.validate(LivePlatformValidation.UPDATE, req);

    const existingPlatform = await this.PrismaService.livePlatform.findFirst({
      where: { id: livePlatformId },
    });

    if (!existingPlatform) {
      throw new HttpException('Live Platform Not Found!', 400);
    }


    if (UpdateLivePlatformRequest.name) {
      UpdateLivePlatformRequest.name = UpdateLivePlatformRequest.name.toUpperCase();
    }


    const updateLivePlatform = await this.PrismaService.livePlatform.update({
    where: {id: livePlatformId},
      data: UpdateLivePlatformRequest,
    });

    return this.toLivePlatformResponse(updateLivePlatform);
  }

  async livePlatformList(): Promise<LivePlatformResponse[]> {
      const livePlatforms = await this.PrismaService.livePlatform.findMany({
      });
  
      this.logger.debug(`List live platform ${JSON.stringify(livePlatforms)}`);
  
      return livePlatforms.map((livePlatform) => this.toLivePlatformResponse(livePlatform));
    }
}