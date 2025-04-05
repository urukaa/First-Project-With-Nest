import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "./config/jwt.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import googleOauthConfig from "./config/google-oauth.config";
import { GoogleStrategy } from "./google.strategy";
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forFeature(googleOauthConfig),

    ConfigModule.forRoot({
      load: [jwtConfig],
    }),

    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.signOptions.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),

    forwardRef(() => UserModule),
  ],
  providers: [JwtStrategy, GoogleStrategy],
  exports: [JwtModule],
})
export class AuthModule {}