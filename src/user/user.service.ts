import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  resError,
  resSuccessData,
  resSuccessMess,
} from 'src/untils/responseService/response.type';
import { IUpdateUser } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { upperCaseName } from 'src/untils/uppercaseName/uppercaseName';
import { ISignUpByAdmin } from './dto/signUp-by-admin.dto';
import { innitAvatar } from 'src/untils/initAvatar/initAvatar';

@Injectable()
export class UserService {
  prisma = new PrismaClient();
  async getListUser(req: Request, res: Response): Promise<any> {
    const role = req.user['role'];

    let data = await this.prisma.users.findMany();

    let userData = data.map((ele) => {
      ele.pass_word = '';
      return ele;
    });

    return resSuccessData(res, 200, 'Get List User Success', userData);
  }

  async getDetailUser(res: Response, req: Request, id: string): Promise<any> {
    let dataUser = await this.prisma.users.findFirst({
      where: {
        id: +id,
      },
    });

    if (!dataUser) {
      return resError(res, 404, 'User not exsited');
    }

    const role = req.user['role'];
    const email = req.user['email'];
    if (role === 'User') {
      if (dataUser.email !== email) {
        dataUser.pass_word = '';
        return resSuccessData(res, 200, 'Success', dataUser);
      }
    }
    return resSuccessData(res, 200, 'Success', dataUser);
  }

  async getPageUser(
    page: string,
    size: string,
    filter: string,
    req: Request,
    res: Response,
  ): Promise<any> {
    if (+page <= 0 || +size <= 0) {
      return resError(res, 400, 'Page vs Size bigger than 0...');
    }
    if (isNaN(Number(page)) || isNaN(Number(size))) {
      return resError(res, 400, 'Page vs Size type is Number');
    }

    let skip = (+page - 1) * +size;

    if (!filter) {
      filter = '';
    }

    const data = await this.prisma.users.findMany({
      where: {
        name: {
          contains: filter,
        },
      },
      skip,
      take: +size,
    });

    const role = req.user['role'];
    const email = req.user['email'];

    if (role === 'User') {
      let newData = data.map((u) => {
        if (u.email !== email) {
          u.pass_word = '';
          return u;
        }
        return u;
      });
      return resSuccessData(res, 200, 'success', newData);
    }

    return resSuccessData(res, 200, 'success', data);
  }

  async getUserByName(req: Request, res: Response, name: string): Promise<any> {
    const data = await this.prisma.users.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });

    const role = req.user['role'];
    const email = req.user['email'];

    if (role === 'User') {
      let newData = data.map((u) => {
        if (u.email !== email) {
          u.pass_word = '';
          return u;
        }
        return u;
      });
      return resSuccessData(res, 200, 'success', newData);
    }

    return resSuccessData(res, 200, 'success', data);
  }

  async updateUser(
    req: Request,
    res: Response,
    id: string,
    body: IUpdateUser,
  ): Promise<any> {
    let userData = await this.prisma.users.findFirst({
      where: { id: +id },
    });

    if (!userData) {
      return resError(res, 404, 'user_id is not exsited');
    }
    if (req.user['role'] === 'User' && req.user['email'] !== userData.email) {
      return resError(res, 400, 'User can only update personal information');
    }

    if (
      userData.role === 'Admin' &&
      req.user['email'] !== userData.email &&
      body.role === 'User'
    ) {
      return resError(
        res,
        400,
        "Admin cann't update role another Admin information",
      );
    }

    if (body.email !== userData.email) {
      return resError(res, 400, "Email Cann't Update");
    }

    if (
      body.phone.length > 11 ||
      body.phone.length < 9 ||
      isNaN(Number(body.phone))
    ) {
      return resError(res, 400, 'Is not type phone number');
    }

    const regularDate = /^\d{2}-\d{2}-\d{4}$/;
    if (!body.birth_day.match(regularDate)) {
      return resError(res, 400, 'Date Should be dd-mm-yyyy');
    }
    const decodePassWord = bcrypt.hashSync(body.pass_word, 10);
    let newData = {
      name: upperCaseName(body.name),
      email: body.email,
      pass_word: decodePassWord,
      phone: body.phone,
      birth_day: body.birth_day,
      gender: 'Male',
      role: body.role,
      skill: body.skill,
      certification: body.certification,
    };
    if (body.gender === false) {
      newData.gender = 'Female';
    }

    if (req.user['role'] === 'User' && body.role !== userData.role) {
      return resError(
        res,
        400,
        'User does not have enough power to set Role Admin ',
      );
    }

    if (
      req.user['role'] === 'Admin' &&
      userData.role === 'Admin' &&
      body.role === 'User'
    ) {
      return resError(res, 400, "Admin cann't set your Role to User");
    }

    try {
      await this.prisma.users.update({ where: { id: +id }, data: newData });

      return resSuccessMess(res, 201, `Update User ID:${id} Success`);
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }

  async deleteUser(req: Request, res: Response, id: string): Promise<any> {
    if (isNaN(Number(id))) {
      return resError(res, 400, 'user_id need number');
    }
    const userData = await this.prisma.users.findFirst({
      where: {
        id: +id,
      },
    });

    if (!userData) {
      return resError(res, 404, 'user_id not exsited');
    }

    if (userData.role === 'Admin') {
      return resError(res, 400, "Admin cann't delete another account Admin");
    }

    try {
      await this.prisma.users.delete({ where: { id: +id } });
      return resSuccessMess(res, 200, `Delete acccount ID:${id} Success`);
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }

  async uploadAvatar(
    req: Request,
    res: Response,
    file: Express.Multer.File,
  ): Promise<any> {
    const userData = await this.prisma.users.findFirst({
      where: {
        email: req.user['email'],
      },
    });
    if (!userData) {
      return resError(res, 404, 'User not exsited');
    }

    try {
      await this.prisma.users.update({
        where: {
          id: userData.id,
        },
        data: {
          avatar: file.path,
        },
      });
      return resSuccessMess(res, 201, 'Update Avatar Success');
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }

  async signUpByAdmin(res: Response, body: ISignUpByAdmin) {
    let { name, email, pass_word, phone, birth_day, gender, role } = body;
    const dataUser = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (dataUser) {
      return resError(res, 400, 'Email already exists');
    }

    if (phone.length > 11 || phone.length < 9 || isNaN(Number(phone))) {
      return resError(res, 400, 'Is not type phone number');
    }

    const regularDate = /^\d{2}-\d{2}-\d{4}$/;
    if (!birth_day.match(regularDate)) {
      return resError(res, 400, 'Date Should be dd-mm-yyyy');
    }

    let dataGender = 'Male';
    if (!gender) {
      dataGender = 'Female';
    }

    const newData = {
      name: upperCaseName(name),
      email,
      pass_word: bcrypt.hashSync(pass_word, 10),
      phone,
      birth_day,
      gender: dataGender,
      role,
      avatar: innitAvatar(name),
      skill: [],
      certification: [],
    };

    try {
      await this.prisma.users.create({
        data: newData,
      });
      return resSuccessMess(res, 201, `Create Account ${role} Success `);
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }
}
