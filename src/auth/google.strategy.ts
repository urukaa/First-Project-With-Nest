import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from './config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private userService: UserService,
  ) {
    super({
      clientID: googleConfiguration.clientID!,
      clientSecret: googleConfiguration.clientSecret!,
      callbackURL: googleConfiguration.callbackURL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    console.log(profile);
    const user = await this.userService.validateGoogleUser({
      name: profile.name.givenName,
      email: profile.emails[0].value,
      phone: 'Google-OAuth',
      username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
      password: uuid(),
    });
    done(null, user);
  }
}
