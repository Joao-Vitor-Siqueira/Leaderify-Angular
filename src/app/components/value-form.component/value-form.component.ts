import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ActivatedRoute } from '@angular/router';
import { ValueRequest, ValueService } from '../../services/value/value-service';
import { EntryMetricValue, MetricValue } from '../../services/leaderboard/leaderboard-service';

@Component({
  selector: 'app-value-form',
  imports: [FormsModule, IconButtonComponent],
  templateUrl: './value-form.component.html',
  styleUrl: './value-form.component.css',
})
export class ValueFormComponent {
  @Input() entryMetricValue!: EntryMetricValue;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() formPassed = new EventEmitter<EntryMetricValue>();

  validateForm(){
    this.formPassed.emit(this.entryMetricValue);
    this.closeDialog.emit();
  }

  validateInput(event: Event, metricValue: MetricValue): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if(!input.value.length){
      input.value = '0';
    }
    if(input.value.length >= 15){
      input.value = input.value.slice(0,15);
    }
    metricValue.value = Number.parseInt(input.value);
  }

}
