import { plainToInstance } from "class-transformer";
import { IsBooleanString, IsInt, IsOptional, IsString, IsUrl, Min, MinLength, validateSync } from "class-validator";

class Env {
  @IsUrl({ require_tld: false })
  DATABASE_URL!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  API_PORT = 4000;

  @IsOptional()
  @IsString()
  API_CORS_ORIGINS = "http://localhost:3000";

  @IsString()
  @MinLength(32)
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @MinLength(32)
  JWT_REFRESH_SECRET!: string;

  @IsOptional()
  @IsString()
  JWT_ACCESS_TTL = "15m";

  @IsOptional()
  @IsInt()
  @Min(1)
  REFRESH_TOKEN_TTL_DAYS = 30;

  @IsOptional()
  @IsString()
  COOKIE_DOMAIN = "";

  @IsOptional()
  @IsBooleanString()
  ALLOW_ADMIN_REGISTRATION = "false";

  @IsOptional()
  @IsString()
  NODE_ENV = "development";
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(Env, config, { enableImplicitConversion: true });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.map(error => error.toString()).join("\n"));
  }

  return validated;
}
