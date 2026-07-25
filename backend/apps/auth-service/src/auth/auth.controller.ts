import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  register(data: {
    email: string;
    name: string;
    password: string;
    role: string;
    ipAddress: string;
    userAgent: string;
  }) {
    return this.auth.register(data);
  }

  @GrpcMethod('AuthService', 'Login')
  login(data: {
    email: string;
    password: string;
    ipAddress: string;
    userAgent: string;
  }) {
    return this.auth.login(data);
  }

  @GrpcMethod('AuthService', 'Refresh')
  refresh(data: {
    refreshToken: string;
    ipAddress: string;
    userAgent: string;
  }) {
    return this.auth.refresh(data);
  }

  @GrpcMethod('AuthService', 'Logout')
  logout(data: { refreshToken: string }) {
    return this.auth.logout(data);
  }

  @GrpcMethod('AuthService', 'GetUser')
  getUser(data: { id: string }) {
    return this.auth.getUser(data);
  }

  @GrpcMethod('AuthService', 'GetUsersByIds')
  getUsersByIds(data: { ids: string[] }) {
    return this.auth.getUsersByIds(data);
  }

  @GrpcMethod('AuthService', 'FindUserByEmail')
  findUserByEmail(data: { email: string }) {
    return this.auth.findUserByEmailRpc(data);
  }

  @GrpcMethod('AuthService', 'DisableUser')
  disableUser(data: { id: string; disabledBy: string }) {
    return this.auth.disableUser(data);
  }

  @GrpcMethod('AuthService', 'ListAuditLogs')
  listAuditLogs(data: { userId: string; limit: number; offset: number }) {
    return this.auth.listAuditLogs(data);
  }

  @GrpcMethod('AuthService', 'VerifyEmail')
  verifyEmail(data: { token: string }) {
    return this.auth.verifyEmail(data);
  }

  @GrpcMethod('AuthService', 'ResendVerificationEmail')
  resendVerificationEmail(data: { userId: string }) {
    return this.auth.resendVerificationEmail(data);
  }

  @GrpcMethod('AuthService', 'RequestPasswordReset')
  requestPasswordReset(data: { email: string }) {
    return this.auth.requestPasswordReset(data);
  }

  @GrpcMethod('AuthService', 'ResetPassword')
  resetPassword(data: { token: string; newPassword: string }) {
    return this.auth.resetPassword(data);
  }
}
