import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { innitAvatar } from 'src/untils/initAvatar/initAvatar';
import {
  resError,
  resSuccessData,
  resSuccessMess,
} from 'src/untils/responseService/response.type';
import { upperCaseName } from 'src/untils/uppercaseName/uppercaseName';
import { ISignIn } from './dto/signin.dto';
import { ISignUp } from './dto/singup.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  prisma = new PrismaClient();
  async create(body: ISignUp, res: Response): Promise<any> {
    let { name, email, pass_word, phone, birth_day, keyword_admin } = body;

    let dataUser = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (dataUser) {
      return resError(res, 400, 'Email is exsited');
    }

    if (phone.length > 11 || phone.length < 9 || isNaN(Number(phone))) {
      return resError(res, 400, 'Is not type phone number');
    }

    let regularDate = /^\d{2}-\d{2}-\d{4}$/;
    if (!birth_day.match(regularDate)) {
      return resError(res, 400, 'Date Should be dd-mm-yyyy');
    }

    let newName = upperCaseName(name);
    let newPassWord = bcrypt.hashSync(pass_word, 10);
    let avatar = innitAvatar(name);
    let role = 'User';
    let skill = null;
    let certification = null;

    if (
      keyword_admin === this.configService.get('KEYWORD_ADMIN') &&
      keyword_admin !== null
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

  async login(body: ISignIn, res: Response): Promise<any> {
    let { email, pass_word } = body;
    let isEmail = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (!isEmail) {
      return resError(res, 404, 'Email is incorrect...');
    }

    let isPassWord = bcrypt.compareSync(pass_word, isEmail.pass_word);
    if (!isPassWord) {
      return resError(res, 404, 'Pass_word is incorrect...');
    }

    let payload = {
      email,
      pass_word,
      role: isEmail.role,
    };

    let token = this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_KEY'),
      expiresIn: this.configService.get('EXPIRESIN'),
    });

    return resSuccessData(res, 200, 'Login Success...', { token });
  }
}
