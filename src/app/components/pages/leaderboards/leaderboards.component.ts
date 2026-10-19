import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
import { SearchbarComponent } from '../../searchbar/searchbar.component';
import { ListviewComponent, TableHeader } from '../../listview/listview.component';
import { IconButtonComponent } from '../../icon-button/icon-button.component';
import {
  LeaderboardResponse,
  LeaderboardService,
} from '../../../services/leaderboard/leaderboard-service';
import { PageResponse, getEmptyPageResponse } from '../../../model/page-response.model';
import { Router } from '@angular/router';
import { CreateLeaderboardComponent } from '../create-leaderboard/create-leaderboard.component';
import { CreateMetricComponent } from '../create-metric/create-metric.component';
import { LoadingComponent } from '../../loading.component/loading.component';

@Component({
  selector: 'app-leaderboards',
  imports: [
    SearchbarComponent,
    ListviewComponent,
    IconButtonComponent,
    CreateLeaderboardComponent,
    CreateMetricComponent,
    LoadingComponent
  ],
  templateUrl: './leaderboards.component.html',
  styleUrl: './leaderboards.component.css',
})
export class LeaderboardsComponent {
  searchTerm: string = '';
  page: number = 0;
  totalElements: number = 0;
  totalPages: number = 0;
  lbObj: object = {};
  deleteId: number = -1;

  data = signal<PageResponse<LeaderboardResponse>>(getEmptyPageResponse());
  loading = signal<boolean>(true);

  headers: TableHeader<LeaderboardResponse>[] = [
    {
      key: 'name',
      header: 'Name'
    },
    {
      key: 'updatedAt',
      header: 'Created'
    },
  ]

  @ViewChildren('dialog')
  dialogs!: QueryList<ElementRef<HTMLDialogElement>>;

  constructor(
    private leaderboardService: LeaderboardService,
    private router: Router,
  ) {}

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.page = 0; // reset pagination when searching
    this.loadData(searchTerm);
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadData(this.searchTerm, page);
  }

  ngOnInit() {
    this.loadData();
  }

  openDialog(name: string) {
    const dialog = this.dialogs.find((ref) => ref.nativeElement.dataset['name'] === name);
    dialog?.nativeElement.showModal();
  }

  closeDialog(name: string) {
    const dialog = this.dialogs.find((ref) => ref.nativeElement.dataset['name'] === name);
    dialog?.nativeElement.close();
  }

  openMetricsDialog(leaderboard: object) {
    this.lbObj = leaderboard;
    this.openDialog('createMetrics');
  }

  openDeleteDialog(lbId: number){
    this.deleteId = lbId;
    this.openDialog('deleteDialog');
  }

  goToLeaderboardPage(lbId: number){
    this.router.navigate([`/leaderboards/${lbId}/views`]);
  }

  deleteLeaderboard(){
    this.leaderboardService.deleteLeaderboard(this.deleteId).subscribe({
      next: () => {
        this.loadData();
        this.deleteId = -1;
        this.closeDialog('deleteDialog');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createLeaderboard(metricsObj: object): void{
    let createLbRequest = {...this.lbObj, ...metricsObj};
    this.leaderboardService.createLeaderboard(createLbRequest).subscribe({
      next: (response) => {
        this.router.navigate([`/leaderboards/${response.id}/views`]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private loadData(name?: string, page?: number): void {
    this.loading.set(true);
    this.leaderboardService.listOwnedLeaderboards(name, page).subscribe({
      next: (response) => {
        this.data.set(response);
        this.page = response.number;
        this.totalElements = response.numberOfElements;
        this.totalPages = response.totalPages;
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
