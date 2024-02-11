import { Injectable } from '@nestjs/common';
import { ISignUp } from './dto/singup.dto';
import { Response } from 'express';
import {
  resError,
  resSuccessMess,
} from 'src/untils/responseService/response.type';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { innitAvatar } from 'src/untils/initAvatar/initAvatar';
import { ConfigService } from '@nestjs/config';
import { upperCaseName } from 'src/untils/uppercaseName/uppercaseName';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  prisma = new PrismaClient();
  async create(body: ISignUp, res: Response): Promise<any> {
    let { name, email, pass_word, phone, birth_day, keyword_admin } = body;

    if (phone.length > 11 || phone.length < 9 || isNaN(Number(phone))) {
      return resError(res, 400, 'Is not type phone number');
    }

    let regularDate = /^\d{2}-\d{2}-\d{4}$/;
    if (!birth_day.match(regularDate)) {
      return resError(res, 400, 'Date Should be dd-mm-yyyy');
    }

    let dataUser = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (dataUser) {
      return resError(res, 400, 'Email is exsited');
    }

    let newName = upperCaseName(name);
    let newPassWord = bcrypt.hashSync(pass_word, 10);
    let avatar = innitAvatar(name);
    let role = 'User';
    let skill = null;
    let certification = null;

    if (
      keyword_admin === this.configService.get('KEYWORD_ADMIN') &&
      keyword_admin !== null &&
      keyword_admin !== ''
    ) {
      role = 'Admin';
    }
    let newData = {
      name: newName,
      email,
      pass_word: newPassWord,
      phone,
      birth_day,
      gender: 'Male',
      role,
      avatar,
      skill,
      certification,
    };
    try {
      await this.prisma.users.create({ data: newData });
      return resSuccessMess(res, 201, `Create Success Account ${role}`);
    } catch (error) {
      return resError(res, 404, error.message);
    }
  }
}
