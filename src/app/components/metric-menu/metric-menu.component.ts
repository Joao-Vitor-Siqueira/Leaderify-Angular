import { Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import {
  MetricResponse,
  Sort,
  ViewMetricConfigResponse,
} from '../../services/metric/metric-service';
import { MetricService, CreateMetricRequest } from '../../services/metric/metric-service';
import { UserLeaderboardService } from '../../services/user-leaderboard/user-leaderboard-service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs';
import { ViewService } from '../../services/view/view-service';
import { MetricFormComponent } from '../metric-form/metric-form.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { LeaderboardState } from '../../services/state/leaderboard/leaderboard-state';
import { LoadingComponent } from '../loading.component/loading.component';

export interface MetricConfig {
  metric: MetricResponse | undefined;
  viewMetricConfig: ViewMetricConfigResponse | undefined;
}

@Component({
  selector: 'app-metric-menu',
  imports: [MetricFormComponent, IconButtonComponent, LoadingComponent],
  templateUrl: './metric-menu.component.html',
  styleUrl: './metric-menu.component.css',
})
export class MetricMenuComponent {
  state = inject(LeaderboardState);

  loading = signal<boolean>(true);
  metrics = signal<MetricConfig[]>([]);
  deleteId = signal<number>(-1);
  errorMsg = signal<string>('');

  selectedMetricConfig = signal<MetricConfig>({
    metric: { id: -1, name: '', description: '' },
    viewMetricConfig: { id: -1, metricId: -1, sort: Sort.DESC, position: -1 },
  });

  dialogTitle = signal<string>('Create Metric');

  @ViewChildren('dialog')
  dialogs!: QueryList<ElementRef<HTMLDialogElement>>;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metricService: MetricService,
    private userLeaderboardService: UserLeaderboardService,
    private viewService: ViewService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  preventDialogClose(event: Event): void {
    event.preventDefault();
}

  showErrorMsg(error: string){
    this.errorMsg.set(error);
  }

  openDeleteDialog(metricId : number){
    this.deleteId.set(metricId);
    this.openDialog('deleteDialog');
  }

  deleteMetric(){
    const lbId = Number.parseInt(this.route.parent?.snapshot.paramMap.get('id')!, 10);
    this.metricService.deleteMetric(lbId, this.deleteId()).subscribe({
        next: () => {
          this.closeDialog('deleteDialog');
          this.loadData();
          this.state.refreshLeaderboard()
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openDialog(name: string) {
    const dialog = this.dialogs.find((ref) => ref.nativeElement.dataset['name'] === name);
    dialog?.nativeElement.showModal();
  }

  closeDialog(name: string) {
    const dialog = this.dialogs.find((ref) => ref.nativeElement.dataset['name'] === name);
    dialog?.nativeElement.close();
    this.selectedMetricConfig.set({
      metric: { id: -1, name: '', description: '' },
      viewMetricConfig: {
        id: -1,
        metricId: -1,
        sort: Sort.DESC,
        position: this.metrics.length + 1,
      },
    });
    this.deleteId.set(-1);
    this.errorMsg.set('');
  }

  openMetricsDialog(metricId: number, viewMetricConfigId: number) {
    this.dialogTitle.set(metricId === -1 ? 'Create Metric' : 'Edit Metric');
    if(metricId !== -1)
      this.loadMetricConfig(metricId, viewMetricConfigId);

    this.openDialog('metricsDialog');
  }

  createUpdateMetric(metricConfig: MetricConfig){
    let request: CreateMetricRequest = {
      name: metricConfig.metric!.name,
      description: metricConfig.metric!.description,
      sort: metricConfig.viewMetricConfig!.sort,
      position: metricConfig.viewMetricConfig!.position
    }
    const lbId = Number.parseInt(this.route.parent?.snapshot.paramMap.get('id')!, 10);

    if(metricConfig.metric!.id === -1){
      this.metricService.createMetric(request, lbId).subscribe({
        next: () => {
          this.errorMsg.set('');
          this.loadData();
          this.state.refreshLeaderboard()
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
    else{
      this.metricService.updateMetric(request, lbId, metricConfig.metric!.id).subscribe({
        next: (response) => {
          console.log(response);
          this.loadData();
          this.state.refreshLeaderboard()
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  loadData() {
    this.loading.set(true);
    const lbId = Number.parseInt(this.route.parent?.snapshot.paramMap.get('id')!, 10);

    let metrics: MetricResponse[];

    this.userLeaderboardService
      .getCurrentUserLeaderboard(lbId)
      .pipe(
        catchError((error) => {
          console.log('Failed to get current user leaderboard:', error);
          this.router.navigate(['/leaderboards']);
          return EMPTY;
        }),

        // Get metrics
        switchMap((userLeaderboard) =>
          this.metricService.listMetrics(lbId).pipe(
            tap((response) => {
              metrics = response.content;
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

        //view metric configs
        switchMap(({ userLbId, viewId }) =>
          this.metricService.listViewMetricConfigs(lbId, userLbId, viewId),
        ),
      )
      .subscribe({
        next: (response) => {
          let metricConfigs: MetricConfig[] = [];

          response.content.forEach((viewMetricConfig) => {
            let metric = metrics.find((m) => m.id === viewMetricConfig.metricId);
            metricConfigs.push({
              metric,
              viewMetricConfig,
            });
          });

          this.metrics.set(metricConfigs);
          this.selectedMetricConfig().viewMetricConfig!.position = this.metrics().length;
          this.loading.set(false);

        },
        error: (error) => {
          console.log('Error:', error);
        },
      });
  }

  loadMetricConfig(metricId: number, viewMetricConfigId: number) {
    const lbId = Number.parseInt(this.route.parent?.snapshot.paramMap.get('id')!, 10);

    let metric: MetricResponse;

    this.userLeaderboardService
      .getCurrentUserLeaderboard(lbId)
      .pipe(
        catchError((error) => {
          console.log('Failed to get current user leaderboard:', error);
          this.router.navigate(['/leaderboards']);
          return EMPTY;
        }),

        // Get metric
        switchMap((userLeaderboard) =>
          this.metricService.getMetric(lbId, metricId).pipe(
            tap((response) => {
              metric = response;
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

        //view metric config
        switchMap(({ userLbId, viewId }) =>
          this.metricService.getViewMetricConfig(lbId, userLbId, viewId, viewMetricConfigId),
        ),
      )
      .subscribe({
        next: (response) => {
          this.selectedMetricConfig.set({ metric, viewMetricConfig: response });
          console.log(this.selectedMetricConfig());
        },
        error: (error) => {
          console.log('Error:', error);
        },
      });
  }
}
