import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthUser } from "../auth/types";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return { user };
  }

  @Get()
  @Roles("admin")
  list() {
    return this.users.listUsers();
  }

  @Get(":id")
  @Roles("admin")
  async get(@Param("id") id: string) {
    const user = await this.users.getById(id);
    return { user: this.users.publicProfile(user) };
  }
}
