import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        }
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard
    // }
  ]
})
export class AppModule {}
