import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { firstValueFrom } from 'rxjs';
import { EntryResponse, EntryService } from '../../services/entry/entry-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entry-form',
  imports: [FormsModule, IconButtonComponent],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css',
})
export class EntryFormComponent {
  @Input() entry!: EntryResponse;
  @Input() title!: string;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() formPassed = new EventEmitter<EntryResponse>();

  errors = signal<string[]>([]);

  constructor(
      private entryService: EntryService,
      private route: ActivatedRoute,
    ){}

  async validateForm(): Promise<void>{
    if(!this.entry.name.length){
      this.errors.set(["A entry must have a name"]);
      return;
    }

    if(this.title === 'Create Metric'){
      try {
        const lbId = Number.parseInt(this.route.parent?.snapshot.paramMap.get('id')!, 10);

        const entryExists = await firstValueFrom(
          this.entryService.entryExists(this.entry.name, lbId)
        );
        if(entryExists){
          this.errors.set(['An entry with the same name already exists in this leaderboard']);
          return;
        }
      } catch (error) {
        this.errors.set(['Unable to verify entry. Please try again.']);
        return;
      }
    }

    this.errors.set([]);
    this.formPassed.emit(this.entry);
    this.closeDialog.emit();
  }
}
