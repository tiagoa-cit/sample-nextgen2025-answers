import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpLoggingInterceptor } from './http-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NextGen 2025')
    .setDescription('Hello, candidates, you are very welcome!!!\n\nThis is the API that we will use to execute the logic of the challenges that you will implement throughout the day.\n\nAt the address below you can access the documentation of the existing API of some functionalities, which will serve as the necessary data for the implementation of all problems\n- http://localhost:3001/swagger\n\nGood challenge to you!!!')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  await app.listen(3001);
}
bootstrap();
