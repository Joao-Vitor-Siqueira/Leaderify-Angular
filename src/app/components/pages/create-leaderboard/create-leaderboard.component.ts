import { Component, EventEmitter, Output, signal } from '@angular/core';
import { IconButtonComponent } from '../../icon-button/icon-button.component';
import { FormsModule } from '@angular/forms';
import { LeaderboardService } from '../../../services/leaderboard/leaderboard-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-leaderboard',
  imports: [IconButtonComponent, FormsModule],
  templateUrl: './create-leaderboard.component.html',
  styleUrl: './create-leaderboard.component.css',
})
export class CreateLeaderboardComponent {
  @Output() closeDialog = new EventEmitter<string>();
  @Output() newLb = new EventEmitter<object>();

  lbName: string = '';
  lbDescription: string = '';
  errors = signal<string[]>([]);

  constructor(private leaderboardService: LeaderboardService) {}

  closeDialogEvent() {
    this.lbName = '';
    this.lbDescription = '';
    this.errors.set([]);
    this.closeDialog.emit('createLeaderboard');
  }

  async nextFormEvent(): Promise<void> {
    if(!this.lbName.length){
      this.errors.set(['A leaderboard must have a name'])
      return;
    }

    try {
      const leaderboardExists = await firstValueFrom(
        this.leaderboardService.leaderboardExists(this.lbName),
      );
      if(leaderboardExists){
        this.errors.set(['A Leaderboard with this name already exists']);
        return;
      }
    } catch (error) {
      this.errors.set(['Unable to verify Leaderboard. Please try again.']);
      return;
    }

    this.newLb.emit({ name: this.lbName, description: this.lbDescription });
    this.closeDialogEvent();
  }
}
