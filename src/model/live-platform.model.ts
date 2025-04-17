import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LivePlatformResponse {
  id?: number;
  name: string;
  coin_type: string;
  price_per_coin: number;
}

export class LivePlatformReq {
  @ApiProperty({ example: 'mico' })
  name: string;

  @ApiProperty({ example: 'gold' })
  coin_type: string;

  @ApiProperty({ example: '2' })
  price_per_coin: number;
}

export class UpdateLivePlatformReq {
  @ApiPropertyOptional({ example: 'mico' })
  
  name?: string;

  @ApiPropertyOptional({ example: 'gold' })
  coin_type?: string;

  @ApiPropertyOptional({ example: '2' })
  price_per_coin?: number;
}