import { Module } from "@nestjs/common";
import { LivePlatformService } from "./live-platform.service";
import { LivePlatformController } from "./live-platform.controller";

@Module({
    providers:[LivePlatformService],
    controllers:[LivePlatformController]
})
export class LivePlatformModule{}