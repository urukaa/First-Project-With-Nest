import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './auth/config/google-oauth.config';
import jwtConfig from './auth/config/jwt.config';
import { ResellerModule } from './reseller/reseller.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Penting supaya config bisa diakses dari mana saja
      load: [googleOauthConfig, jwtConfig], // Semua config dimuat di sini
    }),
    CommonModule,
    UserModule,
    ResellerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
