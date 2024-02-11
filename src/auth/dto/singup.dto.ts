import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ISignUp {
  @ApiProperty({ type: String, description: 'full_name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, description: 'email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'pass_word' })
  @IsString()
  @IsNotEmpty()
  pass_word: string;

  @ApiProperty({ type: String, description: 'phone_number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ type: String, description: 'birth_day' })
  @IsString()
  @IsNotEmpty()
  birth_day: string;

  @ApiProperty({ type: String, description: 'key_for_admin' })
  @IsString()
  keyword_admin: string;
}
