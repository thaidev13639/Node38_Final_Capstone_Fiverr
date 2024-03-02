import { Module } from '@nestjs/common';
import { DetailGroupService } from './detail-group.service';
import { DetailGroupController } from './detail-group.controller';

@Module({
  controllers: [DetailGroupController],
  providers: [DetailGroupService],
})
export class DetailGroupModule {}
