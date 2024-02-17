import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuards implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.user.role === 'User') {
      throw new HttpException(
        'User not enough Power to do this.',
        HttpStatus.FORBIDDEN,
      );
    }
    console.log(request.user);
    return true;
  }
}
