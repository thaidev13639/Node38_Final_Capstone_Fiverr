import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @ApiParam({ name: 'user_id', description: 'user_id' })
  @Get('/detail-user/:user_id')
  getDetailUser(
    @Query('user_id') id: string,
    @Res() res,
    @Req() req,
  ): Promise<any> {
    return this.userService.getDetailUser(res, req, id);
  }
}
