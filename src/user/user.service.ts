import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PrismaService } from "src/common/prisma.service";
import { ValidationService } from "src/common/validation.service";
import { changePasswordReq, jwtPayload, LoginUserReq, RegisterUserReq, UpdateUserReq, UserResponse } from "src/model/user.model";
import { UserValidation } from "./user.validation";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    req: RegisterUserReq,
    isFromOAuth: boolean = false,
  ): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(req)}`);
    const registerRequest: RegisterUserReq = this.validationService.validate(
      UserValidation.REGISTER,
      req,
    );

    const existingUserByEmail = await this.prismaService.user.findUnique({
      where: { email: registerRequest.email },
    });

    if (existingUserByEmail) {
      if (isFromOAuth) {
        // Login saja kalau user-nya memang sudah ada dari Google
        return {
          name: existingUserByEmail.name,
          email: existingUserByEmail.email,
          username: existingUserByEmail.username,
        };
      } else {
        throw new HttpException('Email already use!', 400);
      }
    }

    // Check username availability jika bukan dari OAuth (karena OAuth bisa pakai auto-generate)
    let finalUsername = registerRequest.username;
    if (isFromOAuth) {
      
      finalUsername = await this.generateUniqueUsername(
        finalUsername,
      );
      this.logger.info(`FINAL USERNAME ${JSON.stringify(finalUsername)}`);
    } else {
      const existingUserByUsername = await this.prismaService.user.findUnique({
        where: { username: registerRequest.username },
      });
      if (existingUserByUsername) {
        throw new HttpException('Username already use!', 400);
      }
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    registerRequest.username = finalUsername;

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      name: user.name,
      email: user.email,
      username: user.username,
    };
  }

  async generateUniqueUsername(base: string): Promise<string> {
      let username = base;
      let suffix = 0;

      while (await this.prismaService.user.findUnique({ where: { username } })) {
        suffix++;
        username = `${base}${suffix}`;
      }

      return username;
  }

  private generateJwtToken(user: User):string {
    // Buat token JWT
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.signOptions.expiresIn'),
    });
  }

  async login(req: LoginUserReq): Promise<UserResponse> {
    this.logger.debug(`Login Request ${JSON.stringify(req)}`);

    // Validasi data login
    const user = await this.prismaService.user.findUnique({
      where: { username: req.username },
    });

    if (!user) {
      throw new HttpException('Username or Password is Invalid!', 401);
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(req.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Username or Password is Invalid!', 401);
    }

   const token = this.generateJwtToken(user);

    return {
      name: user.name,
      username: user.username,
      token,
    };
  }

  async loginWithGoogle(username: string): Promise<UserResponse> {
    // Validasi data login
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new HttpException('Username or Password is Invalid!', 401);
    }

    const token = this.generateJwtToken(user);

    return {
      name: user.name,
      username: user.username,
      token,
    };
  }

  async validateGoogleUser(googleUser: RegisterUserReq) {
    this.logger.debug(`Validate Google Request ${JSON.stringify(googleUser)}`);

    // Validasi data login
    const user = await this.prismaService.user.findUnique({
      where: { email: googleUser.email },
    });

    if (user) {
      return user;
    }

    return await this.register(googleUser, true);
  }

  async logout(token: string): Promise<void> {
    const expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // Sesuai dengan expiresIn (1 hari)
    await this.prismaService.tokenBlacklist.create({
      data: {
        token,
        expiredAt,
      },
    });
  }

  async profile(userId: number) {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, username: true, phone: true, email: true },
    });
  }
  
  async update(user: jwtPayload, req: UpdateUserReq): Promise<UserResponse> {
     this.logger.info(`Update userId=${user.userId}`);

     const updateReq: UpdateUserReq = this.validationService.validate(
       UserValidation.UPDATE,
       req,
     );

     const data: Partial<User> = {};
     if (updateReq.name) data.name = updateReq.name;
     if (updateReq.phone) data.phone = updateReq.phone;

     const result = await this.prismaService.user.update({
       where: { id: user.userId, username: user.username },
       data,
     });

     return {
       name: result.name,
       username: result.username,
       phone: result.phone,
     };
  }

  async changePassowrd(currentUser: jwtPayload, req: changePasswordReq, token){
    this.logger.info(`Update userId=${currentUser.userId}`);

    const changePassReq: changePasswordReq = this.validationService.validate(
      UserValidation.CHANGEPASSWORD,
      req,
    );

    const user = await this.prismaService.user.findUnique({
      where: { id: currentUser.userId, username: currentUser.username },
    });
    
     if (!user) {
       throw new HttpException('User not found', 404);
     }
    // Cek old password
    const isPasswordValid = await bcrypt.compare(changePassReq.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Old Password is Invalid!', 401);
    }

    const hashedPassword = await bcrypt.hash(changePassReq.newPassword, 10);

    await this.prismaService.user.update({
      where: { id: currentUser.userId, username: currentUser.username },
      data:  {password: hashedPassword},
    });

    await this.logout(token);
    
  }

}