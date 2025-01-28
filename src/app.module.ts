import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    JwtModule.register({
      secret: "a123b123c123d123",
      global : true
    }),
    ServeStaticModule.forRoot({   
      rootPath: join(__dirname, '..', 'client'),
    }),
    AuthModule,
    ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}