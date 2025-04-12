import { ApiProperty } from '@nestjs/swagger';
import { StatusRegistration } from '@prisma/client';

export class ResellerResponse {
  id?: number;
  status: string;
  phone: string;
  userId?: number;
  name?: string;
  email?: string;
  username?: string;
}

export class RegisterResellerReq {
  @ApiProperty({ example: '0899999999' })
  phone: string;
}

export class VerificationResellerReq {
  id: number;
  
  @ApiProperty({ example: 'ACCEPT' })
  status: StatusRegistration;

}