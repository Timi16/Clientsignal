import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { eq } from "drizzle-orm";
import { DatabaseService } from "../../database/database.service";
import { users } from "../../database/schema";
import { AccessTokenPayload, RequestWithUser } from "../types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly database: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    let payload: AccessTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<AccessTokenPayload>(token, {
        secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user || user.disabledAt) {
      throw new UnauthorizedException("User is not active");
    }

    request.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return true;
  }
}
