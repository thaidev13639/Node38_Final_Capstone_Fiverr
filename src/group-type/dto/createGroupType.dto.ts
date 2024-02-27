import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ICreateGroupType {
  @ApiProperty({ type: String, description: 'name group' })
  @IsString()
  @IsNotEmpty()
  name_group_job: string;

  @ApiProperty({ type: Number, description: 'code group' })
  @IsNumber()
  @IsNotEmpty()
  code_group_job: number;

  @ApiProperty({ type: Number, description: 'Type ID' })
  @IsNotEmpty()
  @IsNumber()
  type_job_id: number;
}
