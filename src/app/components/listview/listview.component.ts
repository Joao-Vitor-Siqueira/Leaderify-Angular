import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageResponse } from '../../model/page-response.model';
import { IconButtonComponent } from '../icon-button/icon-button.component';

export interface TableHeader<T>{
  key: keyof T,
  header: string
}

interface Identifiable {
  id: number;
}

@Component({
  selector: 'app-list-view',
  imports: [IconButtonComponent],
  templateUrl: './listview.component.html',
  styleUrl: './listview.component.css',
})
export class ListviewComponent<T extends Identifiable> {
  @Input() data?: PageResponse<T>;
  @Input() headers: TableHeader<T>[] = [];
  @Input() pageNumber!: number;
  @Input() totalPages!: number;
  @Output() handleRowClick = new EventEmitter<number>();
  @Output() newPage = new EventEmitter<number>();
  @Output() deleteLb = new EventEmitter<number>();


  deleteLeaderboard(id: number){
    this.deleteLb.emit(id);
  }

  nextPage(){
    if(this.pageNumber < this.totalPages)
      this.newPage.emit(this.pageNumber + 1);
  }

  previousPage(){
    if(this.pageNumber > 0)
      this.newPage.emit(this.pageNumber - 1)
  }

  goToElementPage(elementId: number){
    this.handleRowClick.emit(elementId);
  }

  formatDate(date: string | T[keyof T]): string{
    const [year, month, day] = String(date).split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }
}
