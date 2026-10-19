import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface ValueRequest{
  id: number,
  value: number
}

export interface ValueResponse{
  id: number,
  metridId: number,
  entryId: number,
  value: number
}

@Injectable({
  providedIn: 'root',
})
export class ValueService {
  constructor(private readonly http: HttpClient) {}

  updateValues(request: ValueRequest[], lbId: number): Observable<ValueResponse[]>{
      return this.http.patch<ValueResponse[]>(`${API_URL}/leaderboards/${lbId}/values/bulk`, request);
    }
}
