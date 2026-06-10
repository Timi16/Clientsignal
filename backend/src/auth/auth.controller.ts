import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { CurrentUser } from "./decorators/current-user.decorator";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { AuthUser } from "./types";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.auth.register(dto, request, response);
  }

  @Post("login")
  login(@Body() dto: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.auth.login(dto, request, response);
  }

  @Post("refresh")
  refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.auth.refresh(request, response);
  }

  @Post("logout")
  logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.auth.logout(request, response);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return { user };
  }
}
