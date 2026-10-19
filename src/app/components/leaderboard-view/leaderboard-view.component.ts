import { EntryMetricValue, MetricValue } from './../../services/leaderboard/leaderboard-service';
import { ValueRequest, ValueService } from './../../services/value/value-service';
import {
  Component,
  computed,
  ElementRef,
  inject,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { LeaderboardState } from '../../services/state/leaderboard/leaderboard-state';
import { ValueFormComponent } from '../value-form.component/value-form.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../loading.component/loading.component';

@Component({
  selector: 'app-leaderboard-view',
  imports: [ValueFormComponent, LoadingComponent],
  templateUrl: './leaderboard-view.component.html',
  styleUrl: './leaderboard-view.component.css',
})
export class LeaderboardViewComponent {
  state = inject(LeaderboardState);
  lbId!: number;
  currentPos: number = 0;

  selectedEntryMetricValue = signal<EntryMetricValue>({
    name: '',
    scores: [{ valueId: -1, name: '', value: -1 }],
  });

  data = this.state.data;
  headers = this.state.metricHeaders;

  readonly rows = computed(() => {
    const items = this.data().map(item => item.scores.map(score => score.value));
    let currentPos = 0;

    return items.map((element, index) => {
      if(index > 0 && this.isEqual(element, items[index - 1])){
        currentPos --;
      }
      currentPos ++;

      return {
        ...this.state.data()[index],
        position: currentPos,
      };
    });
  });

  @ViewChildren('dialog')
  dialogs!: QueryList<ElementRef<HTMLDialogElement>>;

  constructor(
    private valueService: ValueService,
    private route: ActivatedRoute,
  ) {}

  openDialog(name: string, entryMetricValue: EntryMetricValue) {
    const dialog = this.dialogs.find((ref) => ref.nativeElement.dataset['name'] === name);
    this.selectedEntryMetricValue.set(structuredClone(entryMetricValue));
    dialog?.nativeElement.showModal();
  }

  closeDialog(name: string) {
    const dialog = this.dialogs.find((ref) => ref.nativeElement.dataset['name'] === name);
    dialog?.nativeElement.close();
  }

  updateValue(entryMetricValue: EntryMetricValue) {
    const request: ValueRequest[] = entryMetricValue.scores.map((metricValue) => {
      return { id: metricValue.valueId, value: metricValue.value };
    });

    this.valueService.updateValues(request, this.lbId).subscribe({
      next: () => {
        this.closeDialog('valueDialog');
        this.state.refreshLeaderboard();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    this.lbId = Number.parseInt(this.route.parent?.snapshot.paramMap.get('id')!, 10);
  }

  isEqual(a: number[], b: number[]): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
