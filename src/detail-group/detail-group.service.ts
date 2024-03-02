import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  resError,
  resSuccessData,
  resSuccessMess,
} from 'src/untils/responseService/response.type';
import { ICreateDetailGroup } from './dto/createDetailGroup.dto';
import { upperCaseName } from 'src/untils/uppercaseName/uppercaseName';

@Injectable()
export class DetailGroupService {
  prisma = new PrismaClient();

  async getListDetailGroup(res: Response): Promise<any> {
    try {
      const data = await this.prisma.detail_group_job.findMany();
      return resSuccessData(res, 200, 'Success', data);
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async getDetailGroupId(res: Response, id: string): Promise<any> {
    if (id && isNaN(+id)) {
      return resError(res, 400, 'id should be type Number');
    }

    try {
      const data = await this.prisma.detail_group_job.findFirst({
        where: {
          id: +id,
        },
      });
      resSuccessData(res, 200, 'Success', data);
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async createDetailGroup(
    req: Request,
    res: Response,
    body: ICreateDetailGroup,
  ): Promise<any> {
    const isGroupType = await this.prisma.group_type_jobs.findFirst({
      where: {
        id: body.group_type_id,
      },
    });

    if (!isGroupType) {
      return resError(
        res,
        400,
        `Group Type have ID: ${body.group_type_id} doesn't exists `,
      );
    }

    const email = req.user['email'];
    const userData = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    const newData = {
      name_detail: upperCaseName(body.name_detail),
      group_type_id: body.group_type_id,
      user_id: userData.id,
    };

    try {
      await this.prisma.detail_group_job.create({
        data: newData,
      });
      return resSuccessMess(res, 201, 'Create Detail Group Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }
  async updateDetailGroup(
    res: Response,
    body: ICreateDetailGroup,
    id: string,
  ): Promise<any> {
    if (id && isNaN(+id)) {
      return resError(res, 400, 'id Should be type Number');
    }

    const isDetailGroup = await this.prisma.detail_group_job.findFirst({
      where: {
        id: +id,
      },
    });

    if (!isDetailGroup) {
      return resError(res, 404, `Detail Group have ID: ${id} not exists`);
    }

    const { name_detail, group_type_id } = body;

    const groupTypeData = await this.prisma.group_type_jobs.findFirst({
      where: {
        id: group_type_id,
      },
    });

    if (!groupTypeData) {
      return resError(
        res,
        404,
        `Group Type have ID: ${group_type_id} not exists`,
      );
    }

    let newData = {
      name_detail: upperCaseName(name_detail),
      group_type_id,
    };

    try {
      await this.prisma.detail_group_job.update({
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

  async deleteDetailGroup(res: Response, id: string) {
    if (id && isNaN(+id)) {
      return resError(res, 400, 'id Should be type Number');
    }

    const isDetailGroup = await this.prisma.detail_group_job.findFirst({
      where: {
        id: +id,
      },
    });

    if (!isDetailGroup) {
      return resError(res, 404, `Detail Group have ID: ${id} not exists`);
    }

    try {
      await this.prisma.detail_group_job.delete({
        where: {
          id: +id,
        },
      });
      resSuccessMess(res, 200, `Delete detail group have ID: ${id} Success`);
    } catch (error) {
      return resError(res, 200, error.message);
    }
  }
}
