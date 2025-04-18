import { Body, Controller, Get, HttpCode, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { WebResponse } from "src/model/web.model";
import { changePasswordReq, jwtPayload, LoginUserReq, RegisterUserReq, UpdateUserReq, UserResponse } from "src/model/user.model";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";
import { GoogleAuthGuard } from "src/auth/guards/google-auth/google-auth.guard";
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "@prisma/client";

@ApiTags('Users')
@Controller('/api/auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @HttpCode(200)
  @ApiExcludeEndpoint() // to hidden
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterUserReq })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  async register(@Body() req: RegisterUserReq): Promise<{ message: string }> {
    const result = await this.userService.register(req);
    return {
      message: 'Registration Success',
    };
  }

  @Post('/login')
  @HttpCode(200)
  @ApiExcludeEndpoint() // to hidden
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserReq })
  @ApiResponse({ status: 200, type: WebResponse })
  async login(@Body() req: LoginUserReq): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(req);
    return {
      data: result,
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Google OAuth Login (REDIRECT)' })
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  @HttpCode(200)
  @ApiOperation({ summary: 'Google OAuth Callback' })
  @ApiExcludeEndpoint()
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.userService.loginWithGoogle(req.user.username);
    res.redirect(`${process.env.CALLBACK_URL}${response.token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  profile(@Req() req) {
    return this.userService.profile(req.user.id);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  async logout(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.userService.logout(token);
    }
    return { message: 'Logged out successfully' };
  }

  @Patch('/update')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update current user' })
  async update(
    @CurrentUser() user: User,
    @Body() req: UpdateUserReq,
  ): Promise<{ message: string }> {
    const result = await this.userService.update(user, req);
    return {
      message: 'Update Success',
    };
  }

  @Patch('/change-password')
  @HttpCode(200)
  @ApiExcludeEndpoint() // to hidden
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password current user' })
  async changePassowrd(
    @CurrentUser() user: jwtPayload,
    @Body() req: changePasswordReq,
    @Req() request,
  ): Promise<{ message: string }> {
    const token = request.headers.authorization?.split(' ')[1];
    const result = await this.userService.changePassowrd(user, req, token);
    return {
      message: 'Change Password Success',
    };
  }

  @Get('/test')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  test() {
    return {
      data: 'uruka VO1D',
    };
  }
}