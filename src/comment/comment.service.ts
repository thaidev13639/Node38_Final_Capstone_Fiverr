import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  resError,
  resSuccessData,
  resSuccessMess,
} from 'src/untils/responseService/response.type';
import { ICreateComment } from './dto/createComment.dto';
import { IUpdateComment } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
  prisma = new PrismaClient();
  async getListComment(res: Response): Promise<any> {
    try {
      const data = await this.prisma.comments.findMany();
      return resSuccessData(res, 200, 'Success', data);
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }

  async getListCommentbyCodeJob(res: Response, code_job: string) {

    if (isNaN(Number(code_job))) {
      return resError(res, 400, 'code_job is number');
    }

    const dataCodeJob = await this.prisma.jobs.findFirst({
      where: {
        code_job: +code_job,
      },
    });

    if (!dataCodeJob) {
      return resError(res, 404, `Jobs have code ${+code_job} doesn't exists`);
    }

    const dataComment = await this.prisma.comments.findMany({
      where: {
        code_job: +code_job,
      },
    });

    return resSuccessData(res, 200, 'Success', dataComment);
  }

  async createComment(
    req: Request,
    res: Response,
    body: ICreateComment,
  ): Promise<any> {
    const { code_job, user_id, content, star_comment } = body;
    const email = req.user['email'];

    const codeJobData = await this.prisma.jobs.findFirst({
      where: {
        code_job,
      },
    });

    if (!codeJobData) {
      return resError(res, 404, `Jobs have code ${code_job} doesn't exists`);
    }

    const reqUserData = await this.prisma.users.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!reqUserData) {
      return resError(res, 404, `User have ID:${user_id} doesn't exists`);
    }

    if (email !== reqUserData.email) {
      return resError(res, 400, `You cannot comment for others`);
    }

    if (star_comment > 5 || star_comment < 0) {
      return resError(res, 400, 'star_comment from 0 to 5');
    }

    const newData = {
      code_job,
      user_id,
      date_comment: new Date(),
      content,
      star_comment,
    };

    try {
      await this.prisma.comments.create({
        data: newData,
      });
      return resSuccessMess(res, 201, 'Create Comment Success');
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }

  async deteleComment(req: Request, res: Response, id: string): Promise<any> {
    if (!id || isNaN(Number(id))) {
      return resError(res, 400, 'id_comment should be type Number');
    }
    const isComment = await this.prisma.comments.findFirst({
      where: {
        id: +id,
      },
      include: {
        users: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!isComment) {
      return resError(res, 404, "This comment doesn't exsited");
    }

    const role = req.user['role'];
    const email = req.user['email'];

    if (role !== 'Admin') {
      if (email !== isComment.users.email) {
        return resError(res, 400, "This not your comment, cann't delete");
      }
    }

    try {
      await this.prisma.comments.delete({
        where: {
          id: +id,
        },
      });
      return resSuccessMess(res, 200, `Delete Comment ID:${id} Success`);
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }

  async updateComment(
    req: Request,
    res: Response,
    id: string,
    body: IUpdateComment,
  ): Promise<any> {
    if (!id || isNaN(Number(id))) {
      return resError(res, 400, 'id_comment should be type Number');
    }

    if (body.star_comment > 5 || body.star_comment < 0) {
      return resError(res, 400, 'star_comment from 0 to 5');
    }

    const isComment = await this.prisma.comments.findFirst({
      where: {
        id: +id,
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!isComment) {
      return resError(res, 404, "This comment doesn't exsited");
    }

    const email = req.user['email'];
    if (email !== isComment.users.email) {
      return resError(res, 400, "This not your comment, cann't update");
    }

    const newData = {
      date_comment: new Date(),
      content: body.content,
      star_comment: body.star_comment,
    };

    try {
      await this.prisma.comments.update({
        where: {
          id: +id,
        },
        data: newData,
      });
      return resSuccessMess(res, 200, `Update Comment ID:${id} Success`);
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }
}
