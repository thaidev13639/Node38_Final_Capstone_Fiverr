import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ISignUp } from './dto/singup.dto';
import { ISignIn } from './dto/signin.dto';
import {
  IResponseData,
  IResponseMess,
} from 'src/untils/responseService/response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: ISignUp })
  @Post('/signup')
  create(@Body() body: ISignUp, @Res() res): Promise<any> {
    return this.authService.create(body, res);
  }

  @ApiBody({ type: ISignIn })
  @Post('/signin')
  login(@Body() body: ISignIn, @Res() res): Promise<any> {
    return this.authService.login(body, res);
  }
}
