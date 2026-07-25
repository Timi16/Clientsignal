import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Observable, lastValueFrom } from 'rxjs';
import { Services } from '@cs/common';
import type { AuthUser } from '@cs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import { CorrelationInterceptor } from '../common/interceptors/correlation.interceptor';

interface AuthServiceGrpc {
  register(data: any): Observable<any>;
  login(data: any): Observable<any>;
  refresh(data: any): Observable<any>;
  logout(data: any): Observable<any>;
  getUser(data: any): Observable<any>;
  verifyEmail(data: any): Observable<any>;
  resendVerificationEmail(data: any): Observable<any>;
  requestPasswordReset(data: any): Observable<any>;
  resetPassword(data: any): Observable<any>;
}

const COOKIE_NAME = 'cs_refresh';

@Controller('auth')
@UseFilters(RpcExceptionFilter)
@UseInterceptors(CorrelationInterceptor)
export class AuthProxyController implements OnModuleInit {
  private authService!: AuthServiceGrpc;

  constructor(
    @Inject(Services.AUTH) private readonly authClient: ClientGrpc,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    this.authService = this.authClient.getService<AuthServiceGrpc>('AuthService');
  }

  @Post('register')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async register(
    @Body() body: { email: string; name: string; password: string; role?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await lastValueFrom(
      this.authService.register({
        email: body.email,
        name: body.name,
        password: body.password,
        role: body.role || 'client',
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || '',
      }),
    );

    this.setRefreshCookie(res, result.refreshToken);
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await lastValueFrom(
      this.authService.login({
        email: body.email,
        password: body.password,
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || '',
      }),
    );

    this.setRefreshCookie(res, result.refreshToken);
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[COOKIE_NAME];
    if (!refreshToken) {
      res.status(401).json({ statusCode: 401, message: 'No refresh token' });
      return;
    }

    const result = await lastValueFrom(
      this.authService.refresh({
        refreshToken,
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || '',
      }),
    );

    this.setRefreshCookie(res, result.refreshToken);
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[COOKIE_NAME];
    if (refreshToken) {
      await lastValueFrom(this.authService.logout({ refreshToken }));
    }

    this.clearRefreshCookie(res);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthUser) {
    const result = await lastValueFrom(
      this.authService.getUser({ id: user.id }),
    );
    return result;
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      return { statusCode: 400, message: 'Missing verification token' };
    }
    return lastValueFrom(
      this.authService.verifyEmail({ token }),
    );
  }

  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  async resendVerification(@CurrentUser() user: AuthUser) {
    return lastValueFrom(
      this.authService.resendVerificationEmail({ userId: user.id }),
    );
  }

  @Post('forgot-password')
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  async forgotPassword(@Body() body: { email: string }) {
    return lastValueFrom(
      this.authService.requestPasswordReset({ email: body.email }),
    );
  }

  @Post('reset-password')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return lastValueFrom(
      this.authService.resetPassword({
        token: body.token,
        newPassword: body.newPassword,
      }),
    );
  }

  /* ── Cookie helpers ─────────────────────────────────────── */

  private setRefreshCookie(res: Response, token: string) {
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    const domain = this.config.get<string>('COOKIE_DOMAIN');

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/auth',
      ...(domain ? { domain } : {}),
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  private clearRefreshCookie(res: Response) {
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    const domain = this.config.get<string>('COOKIE_DOMAIN');

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/auth',
      ...(domain ? { domain } : {}),
    });
  }
}
