import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponse {
  id?: number;
  name: string;
  username: string;
  email?: string;
  token?: string;
}

export class jwtPayload {
  userId: number;
  username: string;
}

export class RegisterUserReq {
  @ApiProperty({ example: 'gento' })
  name: string;

  @ApiProperty({ example: 'gento@gmail.com' })
  email: string;

  @ApiProperty({ example: 'gento' })
  username: string;

  @ApiProperty({ example: '12345678' })
  password: string;
}

export class LoginUserReq {
  @ApiProperty({ example: 'gento' })
  username: string;

  @ApiProperty({ example: '12345678' })
  password: string;
}

export class UpdateUserReq {
  @ApiPropertyOptional({ example: 'gentoled' })
  name?: string;
}

export class changePasswordReq {
  @ApiPropertyOptional({ example: '' })
  oldPassword: string;

  @ApiPropertyOptional({ example: '' })
  newPassword: string;
}

