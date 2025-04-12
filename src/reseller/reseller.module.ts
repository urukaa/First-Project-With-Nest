import { Module } from "@nestjs/common";
import { ResellerService } from "./reseller.service";
import { ResellerController } from "./reseller.controller";

@Module({
    providers:[ResellerService],
    controllers:[ResellerController]
})
export class ResellerModule{}