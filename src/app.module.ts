import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommentModule } from './comment/comment.module';
import { TypeJobModule } from './type-job/type-job.module';
import { GroupTypeModule } from './group-type/group-type.module';
import { DetailGroupModule } from './detail-group/detail-group.module';
import { JobModule } from './job/job.module';
import { RentJobModule } from './rent-job/rent-job.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: '/public/image',
    }),
    AuthModule,
    UserModule,
    CommentModule,
    TypeJobModule,
    GroupTypeModule,
    DetailGroupModule,
    JobModule,
    RentJobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
