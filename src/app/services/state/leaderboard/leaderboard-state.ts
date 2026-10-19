import { Injectable, signal } from '@angular/core';
import { EntryMetricValue } from '../../leaderboard/leaderboard-service';
import { Subject } from 'rxjs';

@Injectable()
export class LeaderboardState {
  metricHeaders = signal<string[]>([]);
  data = signal<EntryMetricValue[]>([]);
  loading = signal<boolean>(true);

  private readonly actionSubject = new Subject<void>();
  action$ = this.actionSubject.asObservable();

  refreshLeaderboard(): void {
    this.actionSubject.next();
  }
}
