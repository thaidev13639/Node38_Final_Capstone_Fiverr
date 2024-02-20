import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IUpdateComment {
  @ApiProperty({ type: String, description: 'content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: Number, description: 'star comment' })
  @IsNumber()
  @IsNotEmpty()
  star_comment: number;
}
