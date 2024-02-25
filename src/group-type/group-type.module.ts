import { Module } from '@nestjs/common';
import { GroupTypeService } from './group-type.service';
import { GroupTypeController } from './group-type.controller';

@Module({
  controllers: [GroupTypeController],
  providers: [GroupTypeService],
})
export class GroupTypeModule {}
