import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JobService } from './job.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuards } from 'src/strategy/role.stratey';
import { ICreateJob } from './dto/create-job.dto';
import { IUpdateJob } from './dto/update-job.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IUploadFileDto } from 'src/user/dto/uploadAvatar.dto';
import { MyInterceptor } from 'src/interceptor/imgInterceptor';

@ApiTags('Jobs')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('/list-job')
  getListJob(@Res() res: Response): Promise<any> {
    return this.jobService.getListJob(res);
  }

  @ApiParam({ name: 'id', description: 'job_id' })
  @Get('/detail-job/:id')
  getDetailJob(@Param('id') id: string, @Res() res: Response): Promise<any> {
    return this.jobService.getDetailJob(res, id);
  }

  @ApiQuery({ name: 'filter', description: 'search name', required: false })
  @ApiParam({ name: 'size' })
  @ApiParam({ name: 'page' })
  @Get('/list-job/:page/:size')
  getListJobPagination(
    @Param('page') page: string,
    @Param('size') size: string,
    @Query('filter') filter: string,
    @Res() res: Response,
  ): Promise<any> {
    return this.jobService.getListJobPagination(res, page, size, filter);
  }

  @ApiBody({ type: ICreateJob })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/create-job')
  createJob(
    @Body() body: ICreateJob,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return this.jobService.createJob(req, res, body);
  }

  @ApiParam({ name: 'id', description: 'job_id' })
  @ApiBody({ type: IUpdateJob })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/update-job/:id')
  updateJob(
    @Body() body: IUpdateJob,
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<any> {
    return this.jobService.updateJob(req, res, body, id);
  }

  @ApiParam({ name: 'id', description: 'job_id' })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('delete-job/:id')
  deleteJob(@Param('id') id: string, @Res() res: Response): Promise<any> {
    return this.jobService.deleteJob(res, id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    MyInterceptor,
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/image',
        filename: (req, file, cb) => {
          cb(null, new Date().getTime() + file.originalname);
        },
      }),
    }),
  )
  @ApiParam({ name: 'id', description: 'job_id' })
  @ApiBody({ type: IUploadFileDto, description: 'upload avatar' })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/upload-img-job/:id')
  uploadImgJob(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<any> {
    return this.jobService.uploadImgJob(res, file, id);
  }
}
