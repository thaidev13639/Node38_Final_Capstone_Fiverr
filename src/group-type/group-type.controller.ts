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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupTypeService } from './group-type.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuards } from 'src/strategy/role.stratey';
import { ICreateGroupType } from './dto/createGroupType.dto';
import { Request, Response } from 'express';
import { IUpdateGroupType } from './dto/updateGroupType.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IUploadFileDto } from 'src/user/dto/uploadAvatar.dto';

@ApiTags('Group-Type-Job')
@Controller('group-type')
export class GroupTypeController {
  constructor(private readonly groupTypeService: GroupTypeService) {}

  @Get('/list-group-type')
  getListGroupType(@Res() res: Response): Promise<any> {
    return this.groupTypeService.getListGroupType(res);
  }
  @ApiParam({ name: 'id' })
  @Get('/detail-group-type/:id')
  getDetailType(@Res() res: Response, @Param('id') id: string): Promise<any> {
    return this.groupTypeService.getDetailType(res, id);
  }

  @ApiParam({ name: 'page' })
  @ApiParam({ name: 'size' })
  @ApiQuery({ name: 'filter', description: 'search', required: false })
  @Get('list-group-type/:page/:size')
  getListPagination(
    @Param('page') page: string,
    @Param('size') size: string,
    @Query('filter') filter: string,
    @Res() res: Response,
  ): Promise<any> {
    return this.groupTypeService.getListPagination(res, page, size, filter);
  }

  @ApiBody({ type: ICreateGroupType })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/create-group-type')
  createGroupType(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ICreateGroupType,
  ): Promise<any> {
    return this.groupTypeService.createGroupType(req, res, body);
  }

  @ApiBody({ type: IUpdateGroupType })
  @ApiParam({ name: 'id', description: 'group_type_id' })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/update-group-type/:id')
  updateGroupType(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: IUpdateGroupType,
  ): Promise<any> {
    return this.groupTypeService.updateGroupType(res, id, body);
  }

  @ApiParam({ name: 'id', description: 'group_type_id' })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('/delete-group-type/:id')
  deleteGroupType(@Param('id') id: string, @Res() res: Response) {
    return this.groupTypeService.deleteGroupType(res, id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/image',
        filename: (req, file, cb) => {
          cb(null, new Date().getTime() + file.originalname);
        },
      }),
    }),
  )
  @ApiParam({ name: 'id', description: 'group_type_id' })
  @ApiBody({ type: IUploadFileDto, description: 'upload avatar' })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/upload-img-group-type/:id')
  uploadImageGroupType(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<any> {
    return this.groupTypeService.uploadImageGroupType(res, file, id);
  }
}
