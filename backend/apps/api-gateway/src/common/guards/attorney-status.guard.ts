import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { Services } from '@cs/common';
import type { AuthUser } from '@cs/common';

interface AttorneyServiceGrpc {
  getAttorneyByUserId(data: any): Observable<any>;
}

@Injectable()
export class AttorneyStatusGuard implements CanActivate, OnModuleInit {
  private attorneyService!: AttorneyServiceGrpc;

  constructor(
    @Inject(Services.ATTORNEY) private readonly attorneyClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.attorneyService =
      this.attorneyClient.getService<AttorneyServiceGrpc>('AttorneyService');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: AuthUser | undefined = request.user;

    if (!user || user.role !== 'attorney') {
      return true; // Non-attorney users skip this guard
    }

    try {
      const result = await lastValueFrom(
        this.attorneyService.getAttorneyByUserId({ userId: user.id }),
      );

      if (result?.attorney?.status !== 'approved') {
        throw new ForbiddenException(
          'Attorney account is not approved. Please wait for admin verification.',
        );
      }

      return true;
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      throw new ForbiddenException('Unable to verify attorney status');
    }
  }
}
