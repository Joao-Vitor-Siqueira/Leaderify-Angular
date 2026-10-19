import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserLeaderboardResponse{
  id: number,
  userId: number,
  lbId: number,
  role: Role
}

enum Role {ADMIN = 'ADMIN', EDITOR='EDITOR', VIEWER='VIEWER'}

@Injectable({
  providedIn: 'root',
})
export class UserLeaderboardService {

  constructor(private readonly http: HttpClient){}

  getCurrentUserLeaderboard(lbId: number): Observable<UserLeaderboardResponse>{
      return this.http.get<UserLeaderboardResponse>(`${API_URL}/leaderboards/${lbId}/members/me`);
    }
}
