import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { Services } from '@cs/common';

interface AttorneyGrpcService {
  findMatchingAttorneys(data: {
    practiceArea: string;
    city: string;
    state: string;
  }): Observable<{ attorneys: any[]; total: number }>;
}

@Injectable()
export class MatchingService implements OnModuleInit {
  private attorneyGrpc!: AttorneyGrpcService;

  constructor(
    @Inject(Services.ATTORNEY) private readonly attorneyClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.attorneyGrpc = this.attorneyClient.getService<AttorneyGrpcService>('AttorneyService');
  }

  async findBestMatch(data: {
    practiceArea: string;
    city: string;
    state: string;
  }): Promise<{ attorneyId: string; attorneyUserId: string; attorneyName: string; attorneyEmail: string } | null> {
    try {
      const result = await firstValueFrom(
        this.attorneyGrpc.findMatchingAttorneys({
          practiceArea: data.practiceArea,
          city: data.city || '',
          state: data.state || '',
        }),
      );

      if (!result.attorneys?.length) return null;

      // Pick the best match (first one -- already sorted by location + load)
      const best = result.attorneys[0];
      return {
        attorneyId: best.id,
        attorneyUserId: best.userId,
        attorneyName: best.name || '',
        attorneyEmail: best.email || '',
      };
    } catch {
      return null;
    }
  }
}
