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
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuards } from 'src/strategy/role.stratey';
import { ICreateTypeJob } from './dto/createTypeJob.dto';
import { IUpdateTypeJob } from './dto/updateTypeJob.dto';
import { TypeJobService } from './type-job.service';
import { Request, Response } from 'express';

@ApiTags('Type-Job')
@Controller('type-job')
export class TypeJobController {
  constructor(private readonly typeJobService: TypeJobService) {}

  @Get('/list-type-job')
  getListTypeJob(@Res() res: Response): Promise<any> {
    return this.typeJobService.getListTypeJob(res);
  }

  @Get('/list-full-type-to-detail')
  getListFulltoDetail(@Res() res: Response): Promise<any> {
    return this.typeJobService.getListFulltoDetail(res);
  }

  @ApiParam({ name: 'id', description: 'type_job_id' })
  @Get('/detail-type-job/:id')
  getDetailTypeJob(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<any> {
    return this.typeJobService.getDetailTypeJob(res, id);
  }

  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'size' })
  @ApiQuery({ name: 'filter', description: 'search by name', required: false })
  @Get('/list-type-job/pagination')
  getListTypeJobPagination(
    @Query('page') page: string,
    @Query('size') size: string,
    @Query('filter') filter: string,
    @Res() res: Response,
  ): Promise<any> {
    return this.typeJobService.getListTypeJobPagination(
      res,
      page,
      size,
      filter,
    );
  }

  @ApiBody({ type: ICreateTypeJob })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/create-type-job')
  createTypeJob(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ICreateTypeJob,
  ): Promise<any> {
    return this.typeJobService.createTypeJob(req, res, body);
  }

  @ApiBody({ type: IUpdateTypeJob })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/update-type-job')
  updateTypeJob(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: IUpdateTypeJob,
  ): Promise<any> {
    return this.typeJobService.updateTypeJob(req, res, body);
  }

  @ApiParam({ name: 'id', description: 'type_job_id' })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('/delete-type-job/:id')
  deleteTypeJob(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return this.typeJobService.deleteTypeJob(req, res, id);
  }
}
