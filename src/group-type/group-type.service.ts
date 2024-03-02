import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  resError,
  resSuccessData,
  resSuccessMess,
} from 'src/untils/responseService/response.type';
import { ICreateGroupType } from './dto/createGroupType.dto';
import { innitAvatar } from 'src/untils/initAvatar/initAvatar';
import { IUpdateGroupType } from './dto/updateGroupType.dto';
import { upperCaseName } from 'src/untils/uppercaseName/uppercaseName';

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
          type_job_id: true,
          user_id: true,
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
        type_job_id: true,
        detail_group_job: {
          select: {
            id: true,
            name_detail: true,
            group_type_id: true,
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

  async createGroupType(
    req: Request,
    res: Response,
    body: ICreateGroupType,
  ): Promise<any> {
    let { name_group_job, type_job_id } = body;
    const email = req.user['email'];

    const isTypeJob = await this.prisma.type_jobs.findFirst({
      where: {
        id: type_job_id,
      },
    });

    if (!isTypeJob) {
      return resError(res, 404, `Type Job have ID: ${type_job_id} not exists`);
    }

    const dataUser = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    const newData = {
      name_group_job: upperCaseName(name_group_job),
      image: innitAvatar(name_group_job),
      type_job_id,
      user_id: dataUser.id,
    };

    try {
      await this.prisma.group_type_jobs.create({
        data: newData,
      });
      return resSuccessMess(res, 201, 'Create Group Type Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async updateGroupType(
    res: Response,
    id: string,
    body: IUpdateGroupType,
  ): Promise<any> {
    const { name_group_job, type_job_id } = body;

    if (id && isNaN(Number(id))) {
      return resError(res, 400, 'id should be type Number');
    }

    const isGroupType = await this.prisma.group_type_jobs.findFirst({
      where: {
        id: +id,
      },
    });

    if (!isGroupType) {
      return resError(res, 404, `Group Type have ID: ${id} not exists`);
    }

    const isTypeJob = await this.prisma.type_jobs.findFirst({
      where: {
        id: type_job_id,
      },
    });

    if (!isTypeJob) {
      return resError(res, 400, `Type Job have ID: ${type_job_id} not exists`);
    }

    const newData = {
      name_group_job: upperCaseName(name_group_job),
      image: isGroupType.image,
      type_job_id,
      user_id: isGroupType.user_id,
    };

    try {
      await this.prisma.group_type_jobs.update({
        where: {
          id: +id,
        },
        data: newData,
      });
      return resSuccessMess(res, 201, 'Update Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async deleteGroupType(res: Response, id: string): Promise<any> {
    if (id && isNaN(Number(id))) {
      return resError(res, 400, 'id should be type Number');
    }

    const isGroupType = await this.prisma.group_type_jobs.findFirst({
      where: {
        id: +id,
      },
    });

    if (!isGroupType) {
      return resError(res, 400, `Group Type Job have ID: ${id} not exists`);
    }

    try {
      await this.prisma.group_type_jobs.delete({
        where: {
          id: +id,
        },
      });
      return resSuccessMess(res, 200, 'Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async uploadImageGroupType(
    res: Response,
    file: Express.Multer.File,
    id: string,
  ): Promise<any> {
    try {
      await this.prisma.group_type_jobs.update({
        where: {
          id: +id,
        },
        data: {
          image: file.path,
        },
      });
      return resSuccessMess(res, 200, 'Update image Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }
}
