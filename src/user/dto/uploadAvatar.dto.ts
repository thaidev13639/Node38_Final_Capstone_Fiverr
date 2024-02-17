import { ApiProperty } from '@nestjs/swagger';

export class IUploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file: any;
}
