import { Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DatabaseService } from "../database/database.service";
import { User, users } from "../database/schema";

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async listUsers() {
    const rows = await this.database.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        disabledAt: users.disabledAt,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    return { users: rows };
  }

  async getById(id: string) {
    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  publicProfile(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt,
      disabledAt: user.disabledAt,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}
