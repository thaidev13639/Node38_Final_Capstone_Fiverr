import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  resError,
  resSuccessData,
  resSuccessMess,
} from 'src/untils/responseService/response.type';
import { ICreateJob } from './dto/create-job.dto';
import { upperCaseName } from 'src/untils/uppercaseName/uppercaseName';
import { innitAvatar } from 'src/untils/initAvatar/initAvatar';
import { IUpdateJob } from './dto/update-job.dto';

@Injectable()
export class JobService {
  prisma = new PrismaClient();

  async getListJob(res: Response): Promise<any> {
    try {
      const dataJob = await this.prisma.jobs.findMany();
      return resSuccessData(res, 200, 'Success', dataJob);
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async getDetailJob(res: Response, id: string): Promise<any> {
    if (isNaN(+id)) {
      return resError(res, 400, 'id should be type Number');
    }

    const dataJob = await this.prisma.jobs.findFirst({
      where: {
        id: +id,
      },
    });

    if (!dataJob) {
      return resError(res, 404, `Job have ID: ${id} doesn't exists`);
    }
    return resSuccessData(res, 200, 'Success', dataJob);
  }

  async getListJobPagination(
    res: Response,
    page: string,
    size: string,
    filter: string,
  ): Promise<any> {
    if (isNaN(+page) || isNaN(+size)) {
      return resError(res, 400, 'Page and size should type Number');
    }

    if (+page < 1 || +size < 1) {
      return resError(res, 400, 'page and size should be bigger than 0');
    }

    const index = (+page - 1) * +size;
    try {
      const dataJob = await this.prisma.jobs.findMany({
        where: {
          name_job: {
            contains: filter,
          },
        },
        take: +size,
        skip: index,
      });
      return resSuccessData(res, 200, 'Success', dataJob);
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async createJob(req: Request, res: Response, body: ICreateJob): Promise<any> {
    const email = req.user['email'];
    const {
      name_job,
      rating,
      decription,
      detail_group_id,
      price,
      short_decription,
      star_job,
    } = body;

    if (rating < 1 || rating > 3001) {
      return resError(res, 400, 'rating should be from 1 to 3000');
    }

    if (price < 1 || price > 2000) {
      return resError(res, 400, 'price should be from 1 to 2000');
    }

    if (star_job < 1 || star_job > 5) {
      return resError(res, 400, 'start_job should be from 1 to 5');
    }

    const isDetailGroup = await this.prisma.detail_group_job.findFirst({
      where: {
        id: detail_group_id,
      },
    });

    if (!isDetailGroup) {
      return resError(
        res,
        404,
        `Detail Group have ID: ${detail_group_id} doesn't exists`,
      );
    }

    const useData = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    const newData = {
      name_job: upperCaseName(name_job),
      rating,
      price,
      decription,
      image: innitAvatar(name_job),
      short_decription: upperCaseName(short_decription),
      star_job,
      detail_group_id,
      user_id: useData.id,
    };

    try {
      await this.prisma.jobs.create({
        data: newData,
      });
      return resSuccessMess(res, 201, 'Create Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async updateJob(
    req: Request,
    res: Response,
    body: IUpdateJob,
    id: string,
  ): Promise<any> {
    if (isNaN(+id)) {
      return resError(res, 400, 'id should be type Number');
    }

    const dataJob = await this.prisma.jobs.findFirst({
      where: {
        id: +id,
      },
    });

    if (!dataJob) {
      return resError(res, 404, `Job have ID: ${id} doesn't exists`);
    }

    const email = req.user['email'];

    const {
      name_job,
      rating,
      decription,
      detail_group_id,
      price,
      short_decription,
      star_job,
    } = body;

    if (rating < 1 || rating > 3001) {
      return resError(res, 400, 'rating should be from 1 to 3000');
    }

    if (price < 1 || price > 2000) {
      return resError(res, 400, 'price should be from 1 to 2000');
    }

    if (star_job < 1 || star_job > 5) {
      return resError(res, 400, 'start_job should be from 1 to 5');
    }

    const isDetailGroup = await this.prisma.detail_group_job.findFirst({
      where: {
        id: detail_group_id,
      },
    });

    if (!isDetailGroup) {
      return resError(
        res,
        404,
        `Detail Group have ID: ${detail_group_id} doesn't exists`,
      );
    }

    const useData = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    const newData = {
      name_job: upperCaseName(name_job),
      rating,
      price,
      decription,
      short_decription: upperCaseName(short_decription),
      star_job,
      detail_group_id,
      user_id: useData.id,
    };

    try {
      await this.prisma.jobs.update({
        where: {
          id: +id,
        },
        data: newData,
      });
      return resSuccessMess(res, 200, `Update Job have ID: ${id} Success`);
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async deleteJob(res: Response, id: string): Promise<any> {
    if (isNaN(+id)) {
      return resError(res, 400, 'id shoule be type Number');
    }

    const jobData = await this.prisma.jobs.findFirst({
      where: {
        id: +id,
      },
    });

    if (!jobData) {
      return resError(res, 404, `Job have ID: ${id} doesn't exists`);
    }

    try {
      await this.prisma.jobs.delete({
        where: {
          id: +id,
        },
      });
      return resSuccessMess(res, 200, 'Delete Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async uploadImgJob(
    res: Response,
    file: Express.Multer.File,
    id: string,
  ): Promise<any> {
    
    try {
      await this.prisma.jobs.update({
        where: {
          id: +id,
        },
        data: {
          image: file.path,
        },
      });
      return resSuccessMess(res, 201, 'Update Image Job Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }
}
