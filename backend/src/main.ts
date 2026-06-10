import "reflect-metadata";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const corsOrigins = config.get<string>("API_CORS_ORIGINS", "http://localhost:3000")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

  app.setGlobalPrefix("api");
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(config.get<number>("API_PORT", 4000));
}

void bootstrap();
