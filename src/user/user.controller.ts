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
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { RoleGuards } from 'src/strategy/role.stratey';
import { IUpdateUser } from './dto/updateUser.dto';
import { IUploadFileDto } from './dto/uploadAvatar.dto';
import { UserService } from './user.service';

@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/get-list')
  getListUser(@Req() req, @Res() res): Promise<any> {
    return this.userService.getListUser(req, res);
  }

  @ApiParam({ name: 'user_id' })
  @Get('/detail-user/:user_id')
  getDetailUser(
    @Param('user_id') id: string,
    @Res() res,
    @Req() req,
  ): Promise<any> {
    return this.userService.getDetailUser(res, req, id);
  }

  @ApiQuery({ name: 'filter', description: 'search by name', required: false })
  @ApiParam({ name: 'size' })
  @ApiParam({ name: 'page' })
  @Get('/page-list/:page/:size')
  getPageUser(
    @Param('page') page: string,
    @Param('size') size: string,
    @Query('filter') filter,
    @Req() req,
    @Res() res,
  ): Promise<any> {
    return this.userService.getPageUser(page, size, filter, req, res);
  }

  @ApiParam({ name: 'name', description: 'search by name user need page 1' })
  @Get('/search-user/:name')
  getUserByName(
    @Param('name') name: string,
    @Req() req,
    @Res() res,
  ): Promise<any> {
    return this.userService.getUserByName(req, res, name);
  }

  @ApiParam({ name: 'user_id' })
  @ApiBody({ type: IUpdateUser })
  @Put('/update-user/:user_id')
  updateUser(
    @Param('user_id') id: string,
    @Req() req,
    @Res() res,
    @Body() body: IUpdateUser,
  ): Promise<any> {
    return this.userService.updateUser(req, res, id, body);
  }

  @ApiParam({ name: 'user_id' })
  @UseGuards(RoleGuards)
  @Delete('/delete-user/:user_id')
  deleteUser(@Req() req, @Res() res, @Param('user_id') id): Promise<any> {
    return this.userService.deleteUser(req, res, id);
  }

  @Post('/upload-avatar')
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
  @ApiBody({ type: IUploadFileDto, description: 'upload avatar' })
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Res() res,
  ): Promise<any> {
    return this.userService.uploadAvatar(req, res, file);
  }
}
