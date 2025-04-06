import { Body, Controller, Get, HttpCode, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { WebResponse } from "src/model/web.model";
import { LoginUserReq, RegisterUserReq, UpdateUserReq, UserResponse } from "src/model/user.model";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";
import { GoogleAuthGuard } from "src/auth/guards/google-auth/google-auth.guard";

@Controller('/api/auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @HttpCode(200)
  async register(@Body() req: RegisterUserReq): Promise<{ message: string }> {
    const result = await this.userService.register(req);
    return {
      message: 'Registration Success',
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() req: LoginUserReq): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(req);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @HttpCode(200)
  profile(@Req() req) {
    return this.userService.profile(req.user.userId);
  }

  @Get('/test')
  @HttpCode(200)
  test() {
    return "hello world";
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  @HttpCode(200)
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  @HttpCode(200)
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.userService.loginWithGoogle(req.user.username);
    res.redirect(`${process.env.CALLBACK_URL}${response.token}`);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.userService.logout(token);
    }
    return { message: 'Logged out successfully' };
  }

  // @Patch('/update')
  // @HttpCode(200)
  // async update(@BAuth() user: User, @Body() req: UpdateUserReq): Promise<{ message: string }> {
  //   const result = await this.userService.update(user, req);
  //   return {
  //     message: 'Update Success',
  //   };
  // }
}