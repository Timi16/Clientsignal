import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { Services } from '@cs/common';
import type { AuthUser } from '@cs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import { CorrelationInterceptor } from '../common/interceptors/correlation.interceptor';

interface AttorneyServiceGrpc {
  createProfile(data: any): Observable<any>;
  getAttorneyByUserId(data: any): Observable<any>;
  updateProfile(data: any): Observable<any>;
  getPreferences(data: any): Observable<any>;
  updatePreferences(data: any): Observable<any>;
  getAnalytics(data: any): Observable<any>;
  getIntegrations(data: any): Observable<any>;
  toggleIntegration(data: any): Observable<any>;
}

@Controller('attorneys')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(RpcExceptionFilter)
@UseInterceptors(CorrelationInterceptor)
export class AttorneyProxyController implements OnModuleInit {
  private attorneyService!: AttorneyServiceGrpc;

  constructor(
    @Inject(Services.ATTORNEY) private readonly attorneyClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.attorneyService =
      this.attorneyClient.getService<AttorneyServiceGrpc>('AttorneyService');
  }

  @Post('onboard')
  @Roles('attorney')
  async onboard(@CurrentUser() user: AuthUser, @Body() body: any) {
    return lastValueFrom(
      this.attorneyService.createProfile({
        userId: user.id,
        barNumber: body.barNumber,
        bio: body.bio,
        yearsExperience: body.yearsExperience,
        city: body.city,
        state: body.state,
        firmName: body.firmName,
        specialties: body.specialties,
      }),
    );
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: AuthUser) {
    return lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: AuthUser, @Body() body: any) {
    // First get the attorney ID from user ID
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.attorneyService.updateProfile({
        attorneyId: attorney.attorney.id,
        bio: body.bio,
        city: body.city,
        state: body.state,
        specialties: body.specialties,
      }),
    );
  }

  @Get('preferences')
  async getPreferences(@CurrentUser() user: AuthUser) {
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.attorneyService.getPreferences({ attorneyId: attorney.attorney.id }),
    );
  }

  @Put('preferences')
  async updatePreferences(@CurrentUser() user: AuthUser, @Body() body: any) {
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.attorneyService.updatePreferences({
        attorneyId: attorney.attorney.id,
        notificationSms: body.notificationSms,
        notificationEmail: body.notificationEmail,
        notificationPush: body.notificationPush,
        leadVolumeTarget: body.leadVolumeTarget,
        maxBudget: body.maxBudget,
      }),
    );
  }

  @Get('analytics')
  async getAnalytics(@CurrentUser() user: AuthUser) {
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.attorneyService.getAnalytics({ attorneyId: attorney.attorney.id }),
    );
  }

  @Get('integrations')
  async getIntegrations(@CurrentUser() user: AuthUser) {
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.attorneyService.getIntegrations({ attorneyId: attorney.attorney.id }),
    );
  }

  @Post('integrations/:name/toggle')
  async toggleIntegration(
    @CurrentUser() user: AuthUser,
    @Param('name') name: string,
    @Body() body: { connected: boolean },
  ) {
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.attorneyService.toggleIntegration({
        attorneyId: attorney.attorney.id,
        integrationName: name,
        connected: body.connected,
      }),
    );
  }
}
