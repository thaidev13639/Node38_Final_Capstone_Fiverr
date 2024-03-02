import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ICreateDetailGroup {
  @ApiProperty({ type: String, description: 'name detail' })
  @IsNotEmpty()
  @IsString()
  name_detail: string;

  @ApiProperty({ type: Number, description: 'code of group type' })
  @IsNotEmpty()
  @IsNumber()
  group_type_id: number;
}
