import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { GroupTypeService } from './group-type.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Group-Type-Job')
@Controller('group-type')
export class GroupTypeController {
  constructor(private readonly groupTypeService: GroupTypeService) {}

  @Get('/list-group-type')
  getListGroupType(@Res() res): Promise<any> {
    return this.groupTypeService.getListGroupType(res);
  }
  @ApiParam({ name: 'id' })
  @Get('/detail-group-type/:id')
  getDetailType(@Res() res, @Param('id') id: string): Promise<any> {
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
    @Res() res,
  ): Promise<any> {
    return this.groupTypeService.getListPagination(res, page, size, filter);
  }
}
