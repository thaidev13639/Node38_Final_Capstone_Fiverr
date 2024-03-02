import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  resError,
  resSuccessData,
  resSuccessMess,
} from 'src/untils/responseService/response.type';

@Injectable()
export class RentJobService {
  prisma = new PrismaClient();

  async getListRentJob(res: Response): Promise<any> {
    try {
      const data = await this.prisma.rent_job.findMany();
      return resSuccessData(res, 200, 'Success', data);
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async getListRentPagina(
    res: Response,
    page: string,
    size: string,
  ): Promise<any> {
    if (isNaN(+page) || isNaN(+size)) {
      return resError(res, 400, 'Page and size should type Number');
    }

    if (+page < 1 || +size < 1) {
      return resError(res, 400, 'page and size should be bigger than 0');
    }

    const index = (+page - 1) * +size;
    try {
      const dataJob = await this.prisma.rent_job.findMany({
        take: +size,
        skip: index,
      });
      return resSuccessData(res, 200, 'Success', dataJob);
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async getRentJob(res: Response, id: string): Promise<any> {
    if (isNaN(+id)) {
      return resError(res, 400, 'id should type Number');
    }

    const rentJobData = await this.prisma.rent_job.findFirst({
      where: {
        id: +id,
      },
    });

    if (!rentJobData) {
      return resError(res, 404, `Cannot find rent job have ID: ${id}`);
    }

    return resSuccessData(res, 200, 'Success', rentJobData);
  }

  async getListComplete(res: Response): Promise<any> {
    try {
      const data = await this.prisma.rent_job.findMany({
        where: {
          complete: true,
        },
      });
      return resSuccessData(res, 200, 'Success', data);
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }
  async createRentJob(req: Request, res: Response, id: string): Promise<any> {
    const email = req.user['email'];

    if (isNaN(+id)) {
      return resError(res, 400, 'id should be type Number');
    }

    const jobData = await this.prisma.jobs.findFirst({
      where: {
        id: +id,
      },
    });

    if (!jobData) {
      return resError(res, 404, `Job have ID: ${id} doesn't exists`);
    }

    const userData = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    const newData = {
      job_id: +id,
      user_id: userData.id,
      date_rent: new Date(),
      complete: false,
    };

    try {
      await this.prisma.rent_job.create({
        data: newData,
      });
      return resSuccessMess(res, 201, 'Create Rent Job Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async updateRentJob(res: Response, id: string): Promise<any> {
    if (isNaN(+id)) {
      return resError(res, 400, 'id should be type Number');
    }

    const jobData = await this.prisma.rent_job.findFirst({
      where: {
        id: +id,
      },
    });

    if (!jobData) {
      return resError(res, 404, `Cannot find rent_job have ID: ${id}`);
    }

    const newData = {
      complete: jobData.complete ? false : true,
    };

    try {
      await this.prisma.rent_job.update({
        where: {
          id: +id,
        },
        data: newData,
      });
      return resSuccessMess(res, 200, 'Update Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }

  async deleteRentJob(res: Response, id: string) {
    if (isNaN(+id)) {
      return resError(res, 400, 'id should be type Number');
    }

    const jobData = await this.prisma.rent_job.findFirst({
      where: {
        id: +id,
      },
    });

    if (!jobData) {
      return resError(res, 404, `Cannot find rent_job have ID: ${id}`);
    }

    try {
      await this.prisma.rent_job.delete({
        where: {
          id: +id,
        },
      });
      return resSuccessMess(res, 200, 'Delete Success');
    } catch (error) {
      return resError(res, 500, error.message);
    }
  }
}
