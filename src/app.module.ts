import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommentModule } from './comment/comment.module';
import { TypeJobModule } from './type-job/type-job.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
