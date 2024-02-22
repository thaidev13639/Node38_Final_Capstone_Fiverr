import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IUpdateTypeJob {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  type_id: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name_type: string;
}
