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
import { TypeJobService } from './type-job.service';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ICreateTypeJob } from './dto/createTypeJob.dto';
import { RoleGuards } from 'src/strategy/role.stratey';
import { IUpdateTypeJob } from './dto/updateTypeJob.dto';

@ApiTags('Type-Job')
@Controller('type-job')
export class TypeJobController {
  constructor(private readonly typeJobService: TypeJobService) {}

  @Get('/list-type-job')
  getListTypeJob(@Res() res): Promise<any> {
    return this.typeJobService.getListTypeJob(res);
  }

  @ApiParam({ name: 'id', description: 'type_job_id' })
  @Get('/detail-type-job/:id')
  getDetailTypeJob(@Param('id') id: string, @Res() res) {
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
    @Res() res,
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
  createTypeJob(@Req() req, @Res() res, @Body() body: ICreateTypeJob) {
    return this.typeJobService.createTypeJob(req, res, body);
  }

  @ApiBody({ type: IUpdateTypeJob })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/update-type-job')
  updateTypeJob(@Req() req, @Res() res, @Body() body: IUpdateTypeJob) {
    return this.typeJobService.updateTypeJob(req, res, body);
  }

  @ApiParam({ name: 'id', description: 'type_job_id' })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('/delete-type-job/:id')
  deleteTypeJob(@Param('id') id: string, @Req() req, @Res() res) {
    return this.typeJobService.deleteTypeJob(req, res, id);
  }
}
