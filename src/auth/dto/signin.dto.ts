import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ISignIn {
  @ApiProperty({ type: String, description: 'email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, description: 'pass_word' })
  @IsString()
  @IsNotEmpty()
  pass_word: string;
}
