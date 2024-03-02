import { Module } from '@nestjs/common';
import { RentJobService } from './rent-job.service';
import { RentJobController } from './rent-job.controller';

@Module({
  controllers: [RentJobController],
  providers: [RentJobService],
})
export class RentJobModule {}
