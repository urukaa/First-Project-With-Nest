import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Reseller, Role, StatusRegistration, User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/common/prisma.service";
import { ValidationService } from "src/common/validation.service";
import { RegisterResellerReq, ResellerResponse, VerificationResellerReq } from "src/model/reseller.model";
import { Logger } from "winston";
import { ResellerValidation } from "./reseller.validation";

@Injectable()
export class ResellerService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}
    
    toResellerResponse(reseller: Reseller & {user:User}) : ResellerResponse{
      return {
        id: reseller.id,
        name: reseller.user.name,
        email: reseller.user.email,
        username: reseller.user.username,
        phone: reseller.phone,
        status: reseller.status,
      };
    }
    
    async checkStatus(user: User): Promise<ResellerResponse> {
    this.logger.info(`Check Status Reseller ${JSON.stringify(user)}`);

    const existingSubmission = await this.prismaService.reseller.findFirst({
      where: { user_id: user.id },
      include: { user: true },
    });

    if (!existingSubmission) {
      throw new HttpException('User has not registered as a reseller!', 200);
    }

    return this.toResellerResponse(existingSubmission);
  }

  async RegisterReseller(
    user: User,
    req: RegisterResellerReq,
  ): Promise<ResellerResponse> {
    this.logger.info(`Register Reseller ${JSON.stringify(req)}`);

    const RegisterResellerRequest: RegisterResellerReq =
      this.validationService.validate(ResellerValidation.REGISTER, req);

    const existingSubmission = await this.prismaService.reseller.findFirst({
      where: { user_id: user.id },
    });

    if (existingSubmission) {
      throw new HttpException('User has upload submission', 400);
    }

    const reseller = await this.prismaService.reseller.create({
      data: {
        phone: RegisterResellerRequest.phone,
        status: StatusRegistration.PENDING,
        user_id: user.id,
      },
      include: { user: true },
    });

    return this.toResellerResponse(reseller);
  }

  async UpdateRegisterReseller(
    user: User,
    req: RegisterResellerReq,
  ): Promise<ResellerResponse> {
    this.logger.info(`Update Register Reseller ${JSON.stringify(req)}`);

    const RegisterResellerRequest: RegisterResellerReq =
      this.validationService.validate(ResellerValidation.REGISTER, req);

    const existingSubmission = await this.prismaService.reseller.findFirst({
      where: { user_id: user.id },
    });

    if (!existingSubmission) {
      throw new HttpException('register required', 400);
    }

    if (existingSubmission.user_id !== user.id) {
      throw new HttpException('Forbidden', 403);
    }

    const reseller = await this.prismaService.reseller.update({
      where: { user_id: user.id },
      data: {
        phone: RegisterResellerRequest.phone,
        status: StatusRegistration.PENDING,
      },
      include: { user: true },
    });

    return this.toResellerResponse(reseller);
  }


  async waitingList(): Promise<ResellerResponse[]> {
      const resellers = await this.prismaService.reseller.findMany({include:{user:true}});
      this.logger.debug(`Waiting List Reseller ${JSON.stringify(resellers)}`);

    return resellers.map((reseller) => this.toResellerResponse(reseller))
  }

  async VerificationReseller(
    req: VerificationResellerReq,
  ): Promise<ResellerResponse> {
    this.logger.info(`Update Register Reseller ${JSON.stringify(req)}`);

    const VerificationResellerRequest: VerificationResellerReq =
      this.validationService.validate(ResellerValidation.UPDATESTATUS, req);

    const reseller = await this.prismaService.reseller.findFirst({
      where: { id: VerificationResellerRequest.id },
      include: { user: true },
    });

    if (!reseller) {
      throw new HttpException('data not found!', 400);
    }

    if (reseller.status === StatusRegistration.ACCEPT) {
        await this.prismaService.user.update({
          where: { id: reseller.user_id },
          data: {
            role: Role.USER,
          },
        });
    }

    await this.prismaService.reseller.update({
      where: { id: reseller.id },
      data: {
        status: VerificationResellerRequest.status,
      },
    });

    if (VerificationResellerRequest.status === StatusRegistration.ACCEPT) {
      await this.prismaService.user.update({
        where: { id: reseller.user_id },
        data: {
          role: Role.RESELLER,
        },
      });
    }

    return this.toResellerResponse(reseller);
  }
}
 
