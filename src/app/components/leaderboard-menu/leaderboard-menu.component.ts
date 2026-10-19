import { Component, Input } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { LeaderboardResponse } from '../../services/leaderboard/leaderboard-service';
import { Router } from '@angular/router';

interface buttonConfig{
  title: string,
  handleClick: () => void
}


@Component({
  selector: 'app-leaderboard-menu',
  imports: [IconButtonComponent],
  templateUrl: './leaderboard-menu.component.html',
  styleUrl: './leaderboard-menu.component.css',
})
export class LeaderboardMenuComponent {
  @Input() leaderboard!: LeaderboardResponse;
  test: string = 'Test';
  buttonConfigs: buttonConfig[] = [
    {title : 'Ranking', handleClick: () => this.goToViewsPage()},
    {title : 'Metrics', handleClick: () => this.goToMetricsPage()},
    {title : 'Entries', handleClick: () => this.goToEntriesPage()}
  ]

  constructor(
    private router: Router,
  ){}

  goToEntriesPage(){
    this.router.navigate([`/leaderboards/${this.leaderboard.id}/entries`]);
  }

  goToViewsPage(){
    this.router.navigate([`/leaderboards/${this.leaderboard.id}/views`]);
  }

  goToMetricsPage(){
    this.router.navigate([`/leaderboards/${this.leaderboard.id}/metrics`]);
  }

}
