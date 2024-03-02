import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ICreateJob {
  @ApiProperty({ type: String, description: 'name_job' })
  @IsNotEmpty()
  @IsString()
  name_job: string;

  @ApiProperty({ type: Number, description: 'value rating' })
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty({ type: Number, description: 'price_job' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ type: String, description: 'decription' })
  @IsNotEmpty()
  @IsString()
  decription: string;

  @ApiProperty({ type: String, description: 'short_decription' })
  @IsNotEmpty()
  @IsString()
  short_decription: string;

  @ApiProperty({ type: Number, description: 'star_for_job' })
  @IsNotEmpty()
  @IsNumber()
  star_job: number;

  @ApiProperty({ type: Number, description: 'detail_group_id' })
  @IsNotEmpty()
  @IsNumber()
  detail_group_id: number;
}
