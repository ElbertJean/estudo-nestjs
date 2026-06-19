import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoresModule } from './modules/stores/stores.module';
import { CustomersModule } from './modules/customers/customers.module';
import { SalesModule } from './modules/sales/sales.module';

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
    StoresModule,
    CustomersModule,
    SalesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
