import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupSerivce } from 'src/cronjob/token-cleanup.service';
import r2Config from 'src/r2/r2.config';
import { R2Service } from './r2.service';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            format: winston.format.json(),
            transports: [
                new winston.transports.Console()
            ],
        }),
        ConfigModule.forRoot({
            isGlobal: true
        }),
         ScheduleModule.forRoot(),
        ConfigModule.forFeature(r2Config)
    ],
    providers: [PrismaService, ValidationService, {provide: APP_FILTER, useClass:ErrorFilter}, TokenCleanupSerivce, R2Service],
    exports : [PrismaService, ValidationService, R2Service]
})
export class CommonModule {}
