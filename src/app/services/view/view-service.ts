import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ViewResponse{
  id: number,
  name: string,
  visibility: Visibility
}

enum Visibility {SHOW = 'SHOW', HIDDEN='HIDDEN'}

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  constructor(private readonly http: HttpClient){}

  getBaseView(lbId: number, userLbId: number): Observable<ViewResponse>{
    return this.http.get<ViewResponse>(`${API_URL}/leaderboards/${lbId}/members/${userLbId}/views/base`);
  }
}
