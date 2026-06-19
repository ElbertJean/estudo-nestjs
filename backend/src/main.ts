import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(
    new AllExceptionsFilter(),     // 1º O Genérico (Pega tudo)
    new TypeOrmExceptionFilter()   // 2º O Especialista (Pega os erros de banco)
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Remove automaticamente propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Retorna erro 400 se o cliente enviar propriedades adicionais não permitidas
      transform: true,            // Transforma os payloads em instâncias do DTO correspondente
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('API EVinil')
    .setDescription('Documentação oficial da API da loja de discos de vinil.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000)
}
bootstrap();
