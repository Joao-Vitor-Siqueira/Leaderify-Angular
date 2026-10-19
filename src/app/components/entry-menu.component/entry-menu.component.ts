import { Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { LeaderboardState } from '../../services/state/leaderboard/leaderboard-state';
import { EntryResponse, EntryService, EntryRequest } from '../../services/entry/entry-service';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { UserLeaderboardService } from '../../services/user-leaderboard/user-leaderboard-service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs';
import { EntryFormComponent } from '../entry-form.component/entry-form.component';
import { LoadingComponent } from '../loading.component/loading.component';

@Component({
  selector: 'app-entry-menu',
  imports: [IconButtonComponent, EntryFormComponent, LoadingComponent],
  templateUrl: './entry-menu.component.html',
  styleUrl: './entry-menu.component.css',
})
export class EntryMenuComponent {
  state = inject(LeaderboardState);
  lbId!: number;
  loading = signal<boolean>(true);

  entries = signal<EntryResponse[]>([]);
  deleteId = signal<number>(-1);
  selectedEntry = signal<EntryResponse>({ id: -1, name: '', description: '' });

  dialogTitle = signal<string>('Create Entry');

  @ViewChildren('dialog')
  dialogs!: QueryList<ElementRef<HTMLDialogElement>>;

  constructor(
    private entryService: EntryService,
    private userLeaderboardService: UserLeaderboardService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.lbId = Number.parseInt(this.route.parent?.snapshot.paramMap.get('id')!, 10);
    this.loadData();
  }

  createUpdateEntry(entryResponse: EntryResponse) {
    const request: EntryRequest = {
      name: entryResponse.name,
      description: entryResponse.description,
    };

    if (entryResponse.id === -1) {
      this.entryService.createEntry(request, this.lbId).subscribe({
        next: () => {
          this.loadData();
          this.state.refreshLeaderboard();
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      this.entryService.updateEntry(request, this.lbId, entryResponse.id).subscribe({
        next: () => {
          this.loadData();
          this.state.refreshLeaderboard();
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  deleteEntry() {
    this.entryService.deleteEntry(this.lbId, this.deleteId()).subscribe({
      next: () => {
        this.closeDialog('deleteDialog');
        this.loadData();
        this.state.refreshLeaderboard();
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
    this.selectedEntry.set({ id: -1, name: '', description: '' });
    this.deleteId.set(-1);
  }

  openDeleteDialog(entryId: number) {
    this.deleteId.set(entryId);
    this.openDialog('deleteDialog');
  }

  openEntryDialog(entryId: number) {
    this.dialogTitle.set(entryId === -1 ? 'Create Entry' : 'Edit Entry');
    if (entryId !== -1) this.loadEntry(entryId);

    this.openDialog('entryDialog');
  }

  loadEntry(entryId: number) {
    this.userLeaderboardService
      .getCurrentUserLeaderboard(this.lbId)
      .pipe(
        catchError((error) => {
          console.log('Failed to get current user leaderboard:', error);
          this.router.navigate(['/leaderboards']);
          return EMPTY;
        }),
        switchMap(() => this.entryService.getEntry(this.lbId, entryId)),
      )
      .subscribe({
        next: (response) => {
          this.selectedEntry.set(response);
        },
        error: (error) => {
          console.log('Error:', error);
        },
      });
  }

  loadData() {
    this.loading.set(true);
    this.userLeaderboardService
      .getCurrentUserLeaderboard(this.lbId)
      .pipe(
        catchError((error) => {
          console.log('Failed to get current user leaderboard:', error);
          this.router.navigate(['/leaderboards']);
          return EMPTY;
        }),
        switchMap(() => this.entryService.listEntries(this.lbId)),
      )
      .subscribe({
        next: (response) => {
          this.entries.set(response.content);
          this.loading.set(false);
        },
        error: (error) => {
          console.log('Error:', error);
        },
      });
  }
}
