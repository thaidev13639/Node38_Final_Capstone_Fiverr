import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MyInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const prisma = new PrismaClient();
    const request = context.switchToHttp().getRequest();

    // Lấy các parameter từ request
    const id = request.params.id;

    if (isNaN(+id)) {
      throw new HttpException(`id should type Number`, HttpStatus.BAD_REQUEST);
    }
    const jobData = await prisma.jobs.findFirst({
      where: {
        id: +id,
      },
    });

    if (!jobData) {
      throw new HttpException(
        `This Job have ID: ${id} not exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return next.handle();
  }
}
