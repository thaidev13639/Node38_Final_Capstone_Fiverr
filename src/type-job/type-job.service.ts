import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  resError,
  resSuccessData,
  resSuccessMess,
} from 'src/untils/responseService/response.type';
import { ICreateTypeJob } from './dto/createTypeJob.dto';
import { upperCaseName } from 'src/untils/uppercaseName/uppercaseName';
import { IUpdateTypeJob } from './dto/updateTypeJob.dto';

@Injectable()
export class TypeJobService {
  prisma = new PrismaClient();
  async getListTypeJob(res: Response): Promise<any> {
    try {
      const listTypeJob = await this.prisma.type_jobs.findMany();

      return resSuccessData(res, 200, 'Success', listTypeJob);
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }

  async getDetailTypeJob(res: Response, id: string) {
    if (!id || isNaN(Number(id))) {
      return resError(res, 400, 'id should be Number');
    }

    const detailType = await this.prisma.type_jobs.findFirst({
      where: {
        id: +id,
      },
    });

    if (!detailType) {
      return resError(res, 404, `Type job have ID:${id} doesn't exsited`);
    }
    return resSuccessData(res, 200, 'Success', detailType);
  }

  async getListTypeJobPagination(
    res: Response,
    page: string,
    size: string,
    filter: string,
  ): Promise<any> {
    if (!page || isNaN(Number(page)) || +page <= 0) {
      return resError(res, 400, 'Page type is Number and Bigger than 0');
    }

    if (!size || isNaN(Number(size)) || +size <= 0) {
      return resError(res, 400, 'Size type is Number and Bigger than 0');
    }

    const skip = (+page - 1) * +size;

    try {
      const TypeJobData = await this.prisma.type_jobs.findMany({
        skip,
        take: +size,
        where: {
          name_type: {
            contains: filter,
          },
        },
      });
      return resSuccessData(res, 200, 'Success', TypeJobData);
    } catch (error) {
      resError(res, 404, error.message);
    }
  }

  async createTypeJob(req: Request, res: Response, body: ICreateTypeJob) {
    const email = req.user['email'];

    const userData = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    const newData = {
      name_type: upperCaseName(body.name_type),
      user_id: userData.id,
    };

    try {
      await this.prisma.type_jobs.create({
        data: newData,
      });
      return resSuccessMess(res, 201, 'Create Type Job Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async updateTypeJob(req: Request, res: Response, body: IUpdateTypeJob) {
    const email = req.user['email'];

    const typeJobData = await this.prisma.type_jobs.findFirst({
      where: {
        id: body.type_id,
      },
    });

    if (!typeJobData) {
      return resError(
        res,
        404,
        `Type Job have ID: ${body.type_id} doesn't exsited`,
      );
    }

    const userData = await this.prisma.users.findFirst({
      where: {
        id: typeJobData.user_id,
      },
    });

    if (email !== userData.email) {
      return resError(
        res,
        400,
        'This not your TypeJob create, so can not update',
      );
    }

    try {
      await this.prisma.type_jobs.update({
        where: {
          id: body.type_id,
        },
        data: {
          name_type: upperCaseName(body.name_type),
        },
      });
      return resSuccessMess(
        res,
        200,
        `Update TypeJob have ID: ${body.type_id} Success`,
      );
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async deleteTypeJob(req: Request, res: Response, id: string) {
    if (isNaN(Number(id))) {
      return resError(res, 400, 'id should be type Number');
    }

    const typeData = await this.prisma.type_jobs.findFirst({
      where: {
        id: +id,
      },
    });

    if (!typeData) {
      return resError(res, 404, `Type have ID: ${id} doesn't exsited`);
    }

    const email = req.user['email'];

    const userData = await this.prisma.users.findFirst({
      where: {
        id: typeData.user_id,
      },
    });

    if (email !== userData.email) {
      return resError(res, 400, 'Only the creator can be deleted');
    }

    try {
      await this.prisma.type_jobs.delete({ where: { id: +id } });
      return resSuccessMess(res, 200, 'Delete Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }
}
