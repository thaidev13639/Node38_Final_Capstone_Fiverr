import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DetailGroupService } from './detail-group.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ICreateDetailGroup } from './dto/createDetailGroup.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuards } from 'src/strategy/role.stratey';

@ApiTags('Detail-group-type')
@Controller('detail-group')
export class DetailGroupController {
  constructor(private readonly detailGroupService: DetailGroupService) {}

  @Get('/list-detail-group')
  getListDetailGroup(@Res() res: Response): Promise<any> {
    return this.detailGroupService.getListDetailGroup(res);
  }

  @ApiParam({ name: 'id', description: 'detail_group_id' })
  @Get('/detail-group/:id')
  getDetailGroupId(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<any> {
    return this.detailGroupService.getDetailGroupId(res, id);
  }

  @ApiBody({ type: ICreateDetailGroup })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/create-detail-group')
  createDetailGroup(
    @Body() body: ICreateDetailGroup,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    return this.detailGroupService.createDetailGroup(req, res, body);
  }

  @ApiParam({ name: 'id', description: 'id_detail_group' })
  @ApiBody({ type: ICreateDetailGroup })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/update-detail-group/:id')
  updateDetailGroup(
    @Res() res: Response,
    @Body() body: ICreateDetailGroup,
    @Param('id') id: string,
  ): Promise<any> {
    return this.detailGroupService.updateDetailGroup(res, body, id);
  }

  @ApiParam({ name: 'id', description: 'id_detail_group' })
  @UseGuards(RoleGuards)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('/delete-detail-group/:id')
  deleteDetailGroup(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<any> {
    return this.detailGroupService.deleteDetailGroup(res, id);
  }
}
