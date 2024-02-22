import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ICreateTypeJob {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name_type: string;
}
