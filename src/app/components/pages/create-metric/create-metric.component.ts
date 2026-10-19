import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconButtonComponent } from '../../icon-button/icon-button.component';
import { MetricRequest } from '../../../services/metric/metric-service';

@Component({
  selector: 'app-create-metric',
  imports: [FormsModule, IconButtonComponent],
  templateUrl: './create-metric.component.html',
  styleUrl: './create-metric.component.css',
})
export class CreateMetricComponent {
  @Output() closeDialog = new EventEmitter<string>();
  @Output() newMetrics = new EventEmitter<object>();
  @Input() createLb!: boolean;

  errors = signal<string[]>([]);
  metrics = signal<MetricRequest[]>([]);
  orders = signal<string[]>([]);

  metricName: string = '';
  metricDesc: string = '';
  metricOrder: string = 'DESC';


  closeDialogEvent() {
    this.metricName = '';
    this.metricDesc = '';
    this.errors.set([]);
    this.metrics.set([]);
    this.orders.set([]);
    this.closeDialog.emit('createMetrics');
  }

  addMetric(){
    if(!this.createLb){
      //check if metric exists in existing lb
      return;
    }
    if(this.metrics().some(metric => metric.name! === this.metricName)){
      this.errors.set(["A metric with this name already exists"])
      return;
    }

    if(!this.metricName.length){
      this.errors.set(["A metric must have a name"]);
      return;
    }

    this.errors.set([]);
    this.metrics.set([...this.metrics(),{"name" : this.metricName, "description": this.metricDesc}]);
    this.orders.set([...this.orders(), this.metricOrder]);
  }

  removeMetric(name: string){
    let index: number = this.metrics().findIndex(metric => metric.name === name);

    this.metrics.set(this.metrics().filter((_, i) => i !== index));
    this.orders.set(this.orders().filter((_, i) => i !== index));
  }

  finish(){
    if(!this.metrics().length){
      this.errors.set(["A leaderboard must have at least one metric"]);
      return;
    }
    this.errors.set([]);
    this.newMetrics.emit({"metrics": [...this.metrics()], "metricSorts": [...this.orders()]});
  }
}
