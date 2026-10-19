import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MetricConfig } from '../metric-menu/metric-menu.component';
import { FormsModule } from '@angular/forms';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { firstValueFrom } from 'rxjs';
import { MetricService } from '../../services/metric/metric-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-metric-form',
  imports: [FormsModule, IconButtonComponent],
  templateUrl: './metric-form.component.html',
  styleUrl: './metric-form.component.css',
})
export class MetricFormComponent {
  @Input() metricConfig!: MetricConfig;
  @Input() totalMetrics!: number;
  @Input() title!: string;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() formPassed = new EventEmitter<MetricConfig>();
  @Output() showError = new EventEmitter<string>();


  validatePosition(event: Event): void {
  const input = event.target as HTMLInputElement;
  const max = this.metricConfig.metric!.id === -1 ? this.totalMetrics : this.totalMetrics - 1;
  input.value = input.value.replace(/\D/g, '');
  if (input.value === '') {
    return;
  }
  let value = Number.parseInt(input.value, 10);
  if (value > max) {
    value = max;
    input.value = String(max);
  }
  this.metricConfig.viewMetricConfig!.position = value;
  }

  constructor(
    private metricService: MetricService,
    private route: ActivatedRoute,
  ){}

  async validateForm(): Promise<void>{
    if(!this.metricConfig!.metric!.name.length){
      this.showError.emit("A metric must have a name");
      return;
    }

    if(!String(this.metricConfig.viewMetricConfig!.position).length){
      this.showError.emit("A metric must have a position");
      return;
    }

    if(this.title === 'Create Metric'){
      try {
        const lbId = Number.parseInt(this.route.parent?.snapshot.paramMap.get('id')!, 10);

        const metricExists = await firstValueFrom(
          this.metricService.metricExists(this.metricConfig.metric!.name, lbId)
        );
        if(metricExists){
          this.showError.emit('A metric with the same name already exists in this leaderboard');
          return;
        }
      } catch (error) {
        this.showError.emit('Unable to verify Metric. Please try again.');
        return;
      }
    }

    this.showError.emit('');
    this.formPassed.emit(this.metricConfig)
    this.closeDialog.emit();
  }

}
