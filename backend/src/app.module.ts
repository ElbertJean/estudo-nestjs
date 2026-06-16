import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AddressModule } from './modules/address/address.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { AuthController } from './modules/auth/auth.controller';

@Module({
  imports: [
    // 1. Carrega as variáveis de ambiente do arquivo .env de forma global
    ConfigModule.forRoot({
      envFilePath: ['.env', '../.env'],
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    UsersModule,
    AddressModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
