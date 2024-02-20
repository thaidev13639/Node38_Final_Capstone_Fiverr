import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ICreateComment {
  @ApiProperty({ type: Number, description: 'code_job' })
  @IsNumber()
  @IsNotEmpty()
  code_job: number;

  @ApiProperty({ type: Number, description: 'user_id' })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ type: String, description: 'content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: Number, description: 'star comment' })
  @IsNumber()
  @IsNotEmpty()
  star_comment: number;
}
