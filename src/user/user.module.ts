import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
