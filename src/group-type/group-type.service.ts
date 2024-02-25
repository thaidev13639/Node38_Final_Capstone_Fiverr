import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import {
  resError,
  resSuccessData,
  resSuccessMess,
} from 'src/untils/responseService/response.type';

@Injectable()
export class GroupTypeService {
  prisma = new PrismaClient();

  async getListGroupType(res: Response): Promise<any> {
    try {
      const groupData = await this.prisma.group_type_jobs.findMany({
        select: {
          id: true,
          name_group_job: true,
          image: true,
          code_group_job: true,
          detail_group_job: {
            select: {
              id: true,
              name_detail: true,
              code_detail_group: true,
            },
          },
        },
      });
      return resSuccessData(res, 200, 'Success', groupData);
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async getDetailType(res: Response, id: string): Promise<any> {
    if (id && isNaN(Number(id))) {
      return resError(res, 400, 'id should be Type Number');
    }

    const typeData = await this.prisma.group_type_jobs.findFirst({
      where: {
        id: +id,
      },
      select: {
        id: true,
        name_group_job: true,
        image: true,
        code_group_job: true,
        detail_group_job: {
          select: {
            id: true,
            name_detail: true,
            code_detail_group: true,
          },
        },
      },
    });
    if (!typeData) {
      return resError(res, 404, `Group Type have ID: ${id} doesn't exsits`);
    }

    return resSuccessData(res, 200, 'Success', typeData);
  }

  async getListPagination(
    res: Response,
    page: string,
    size: string,
    filter: string,
  ): Promise<any> {
    if (isNaN(Number(page)) || isNaN(Number(size))) {
      return resError(res, 400, 'Page and Size should Type Number');
    }

    if (+page <= 0 || +size <= 0) {
      return resError(res, 400, 'Page and Size bigger than 0');
    }

    const index = (+page - 1) * +size;

    const data = await this.prisma.group_type_jobs.findMany({
      take: +size,
      skip: index,
      where: {
        name_group_job: {
          contains: filter,
        },
      },
    });
    return resSuccessData(res, 200, 'Success', data);
  }
}
