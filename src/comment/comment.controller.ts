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
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ICreateComment } from './dto/createComment.dto';
import { IUpdateComment } from './dto/updateComment.dto';
import { Request, Response } from 'express';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/list-comment')
  getListComment(@Res() res: Response): Promise<any> {
    return this.commentService.getListComment(res);
  }

  @ApiParam({ name: 'code_job' })
  @Get('/list-comment-by-code-job/:code_job')
  getListCommentbyCodeJob(
    @Param('code_job') code_job: string,
    @Res() res: Response,
  ) {
    return this.commentService.getListCommentbyCodeJob(res, code_job);
  }

  @ApiBody({ type: ICreateComment })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/create-comment')
  createComment(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ICreateComment,
  ): Promise<any> {
    return this.commentService.createComment(req, res, body);
  }

  @ApiParam({ name: 'id_comment' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:id_comment')
  deteleComment(
    @Param('id_comment') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return this.commentService.deteleComment(req, res, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id_comment' })
  @ApiBody({ type: IUpdateComment })
  @Put('/update-comment/:id_comment')
  updateComment(
    @Param('id_comment') id: string,
    @Body() body: IUpdateComment,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return this.commentService.updateComment(req, res, id, body);
  }
}
