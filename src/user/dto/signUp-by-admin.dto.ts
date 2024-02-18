import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

enum Role {
  User = 'User',
  Admin = 'Admin',
}
export class ISignUpByAdmin {
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

  @ApiProperty({ type: Boolean, description: 'gender' })
  @IsBoolean()
  @IsNotEmpty()
  gender: boolean;

  @ApiProperty({ enum: Role, description: 'role' })
  @IsString()
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
