import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { LeaderboardService, LeaderboardResponse } from '../../../services/leaderboard/leaderboard-service';
import { UserLeaderboardService } from '../../../services/user-leaderboard/user-leaderboard-service';
import { ViewService } from '../../../services/view/view-service';
import { Router } from '@angular/router';
import { switchMap, map, catchError, EMPTY, tap } from 'rxjs';
import { MetricService } from '../../../services/metric/metric-service';
import { LeaderboardMenuComponent } from '../../leaderboard-menu/leaderboard-menu.component';
import { LeaderboardState } from '../../../services/state/leaderboard/leaderboard-state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-leaderboard',
  imports: [LeaderboardMenuComponent, RouterOutlet],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css',
  providers: [LeaderboardState]
})
export class LeaderboardComponent {
  state = inject(LeaderboardState);

  leaderboard = signal<LeaderboardResponse>({
    id: 0,
    name: '',
    description: '',
    createdAt: '',
    updatedAt: ''
  });

  constructor(
    private route: ActivatedRoute,
    private leaderboardService: LeaderboardService,
    private userLeaderboardService: UserLeaderboardService,
    private viewService: ViewService,
    private metricService: MetricService,
    private router: Router,
  ) {

    this.state.action$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.loadData();
      });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.state.loading.set(true);
    const lbId = Number.parseInt(this.route.snapshot.paramMap.get('id')!, 10);

    this.userLeaderboardService
      .getCurrentUserLeaderboard(lbId)
      .pipe(
        catchError((error) => {
          console.log('Failed to get current user leaderboard:', error);
          this.router.navigate(['/leaderboards']);
          return EMPTY;
        }),

        // Get leaderboard
        switchMap((userLeaderboard) =>
          this.leaderboardService.getLeaderboard(lbId).pipe(
            tap((response) => {
              this.leaderboard.set(response);
            }),
            map(() => userLeaderboard),
          ),
        ),

        // Get metric Headers
        switchMap((userLeaderboard) =>
          this.metricService.listMetrics(lbId).pipe(
            tap((response) => {
              this.state.metricHeaders.set(response.content.map(metric => metric.name));
            }),
            map(() => userLeaderboard),
          ),
        ),

        //get base view
        switchMap((userLeaderboard) =>
          this.viewService.getBaseView(lbId, userLeaderboard.id).pipe(
            map((view) => ({
              userLbId: userLeaderboard.id,
              viewId: view.id,
            })),
          ),
        ),

        //get computed result
        switchMap(({ userLbId, viewId }) =>
          this.leaderboardService.computeLeaderboard(lbId, userLbId, viewId),
        ),
      )
      .subscribe({
        next: (response) => {
          this.state.data.set(response.content[0].entryMetricValues);
          this.state.loading.set(false);
        },
        error: (error) => {
          this.state.loading.set(false);
          console.log('Error:', error);
        },
      });
  }
}
