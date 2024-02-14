import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import e, { Request, Response } from 'express';
import {
  resError,
  resSuccessData,
} from 'src/untils/responseService/response.type';

@Injectable()
export class UserService {
  prisma = new PrismaClient();
  async getListUser(req: Request, res: Response): Promise<any> {
    let role = req.user['role'];

    let data = await this.prisma.users.findMany();

    if (!role || role === 'User') {
      let userData = data.map((ele) => {
        ele.pass_word = '';
        return ele;
      });
      return resSuccessData(res, 200, 'Get List User Success', userData);
    }

    return resSuccessData(res, 200, 'Get List User Success', data);
  }

  async getDetailUser(res: Response, req: Request, id: string) {
    let dataUser = await this.prisma.users.findFirst({
      where: {
        id: +id,
      },
    });

    if (!dataUser) {
      return resError(res, 404, 'User not exsited');
    }

    let role = req.user['role'];
    let email = req.user['email'];
    if (role === 'User') {
      if (dataUser.email === email) {
        return resSuccessData(res, 200, 'Success', dataUser);
      }
      dataUser.pass_word = '';
      return resSuccessData(res, 200, 'Success', dataUser);
    }
    return resSuccessData(res, 200, 'Success', dataUser);
  }
}
