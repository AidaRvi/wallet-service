import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './logger.interceptor';
import { UserService } from './balance/user.service';

let app: INestApplication<any>;

async function bootstrap() {
  app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('wallet-service')
    .setDescription('The wallet-service API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('document', app, document);

  const port = configService.get('PORT');
  await app.listen(port, () => {
    console.log(`wallet-service is running on port "${port}"`);
  });
}
bootstrap().then(async () => {
  await createUserInDatabase();
});

const createUserInDatabase = async (): Promise<void> => {
  const randomUsername = `user_${Math.random().toString(36).substring(2, 8)}`;
  const userService = app.get(UserService);
  const user = await userService.createUser(randomUsername, 1000);
  console.log(`** created userId: ${user.id}`);
};
