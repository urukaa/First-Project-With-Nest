import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "src/common/prisma.service";

@Injectable()
export class TokenCleanupSerivce{
    constructor(private readonly prismaService: PrismaService){}

        @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
        async handleCleanup() {
            const deleted = await this.prismaService.tokenBlacklist.deleteMany({
                where: {
                    expiredAt: {
                         lt: new Date(),
                    }
                }
            });
            console.log(`[CRON] Token expired deleted: ${deleted.count}`);
    }
}