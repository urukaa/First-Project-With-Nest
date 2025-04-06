import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { GoogleStrategy } from "./google.strategy";
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule,
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