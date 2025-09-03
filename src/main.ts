import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exception.filter";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  await app.listen(process.env.APP_PORT ?? 3000);
}
void bootstrap();
