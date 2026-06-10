import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { userRoleEnum, UserRole } from "../../database/schema";

export class RegisterDto {
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: "password must include uppercase, lowercase, and a number",
  })
  password!: string;

  @IsOptional()
  @IsEnum(userRoleEnum.enumValues)
  role?: UserRole;
}
