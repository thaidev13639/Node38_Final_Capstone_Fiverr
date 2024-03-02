import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RentJobService } from './rent-job.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuards } from 'src/strategy/role.stratey';

@ApiTags('Rent-Job')
@Controller('rent-job')
export class RentJobController {
  constructor(private readonly rentJobService: RentJobService) {}

  @Get('/list-rent-job')
  getListRentJob(@Res() res: Response): Promise<any> {
    return this.rentJobService.getListRentJob(res);
  }

  @ApiParam({ name: 'page' })
  @ApiParam({ name: 'size' })
  @Get('/list-rent-job/:page/:size')
  getListRentPagina(
    @Res() res: Response,
    @Param('page') page: string,
    @Param('size') size: string,
  ): Promise<any> {
    return this.rentJobService.getListRentPagina(res, page, size);
  }

  @ApiParam({ name: 'id', description: 'rent_job_id' })
  @Get('/rent-job/:id')
  getRentJob(@Param('id') id: string, @Res() res: Response): Promise<any> {
    return this.rentJobService.getRentJob(res, id);
  }

  @Get('/list-complete-rent-job')
  getListComplete(@Res() res: Response): Promise<any> {
    return this.rentJobService.getListComplete(res);
  }

  @ApiParam({ name: 'id', description: 'job_id' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/create-rent-job/:id')
  createRentJob(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<any> {
    return this.rentJobService.createRentJob(req, res, id);
  }

  @ApiParam({ name: 'id', description: 'rent_job_id' })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/update-rent-job/:id')
  updateRentJob(@Param('id') id: string, @Res() res: Response): Promise<any> {
    return this.rentJobService.updateRentJob(res, id);
  }

  @ApiParam({ name: 'id', description: 'rent_job_id' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('/delete-rent-job/:id')
  deleteRentJob(@Param('id') id: string, @Res() res: Response): Promise<any> {
    return this.rentJobService.deleteRentJob(res, id);
  }
}
