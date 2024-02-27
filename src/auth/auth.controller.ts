import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ISignIn } from './dto/signin.dto';
import { ISignUp } from './dto/singup.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: ISignUp })
  @Post('/signup')
  create(@Body() body: ISignUp, @Res() res: Response): Promise<any> {
    return this.authService.create(body, res);
  }

  @ApiBody({ type: ISignIn })
  @Post('/signin')
  login(@Body() body: ISignIn, @Res() res: Response): Promise<any> {
    return this.authService.login(body, res);
  }
}
