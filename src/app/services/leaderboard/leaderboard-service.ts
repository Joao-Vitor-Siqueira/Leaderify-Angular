import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageResponse } from '../../model/page-response.model';

export interface LeaderboardResponse {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface MetricValue {
  valueId: number
  name: string,
  value: number
}

export interface EntryMetricValue{
  name: string,
  scores: MetricValue[]
}

export interface CalculationResponse{
  entryMetricValues: EntryMetricValue[]
}


@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private readonly apiUrl = API_URL + '/leaderboards';

  constructor(private readonly http: HttpClient) {}

  leaderboardExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/leaderboard-exists?name=${encodeURIComponent(name)}`,
    );
  }

  getLeaderboard(id: number): Observable<LeaderboardResponse>{
    return this.http.get<LeaderboardResponse>(`${this.apiUrl}/${id}`);
  }

  listOwnedLeaderboards(
    name?: string,
    pageNumber?: number,
  ): Observable<PageResponse<LeaderboardResponse>> {
    let params = new HttpParams();

    if (pageNumber !== undefined) {
      params = params.set('page', pageNumber.toString());
    }

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<PageResponse<LeaderboardResponse>>(this.apiUrl + "/owned", { params });
  }

  createLeaderboard(createLeaderboardRequest: object): Observable<LeaderboardResponse>{
    return this.http.post<LeaderboardResponse>(this.apiUrl,createLeaderboardRequest);
  }

  deleteLeaderboard(lbId: number): Observable<void>{
      return this.http.delete<void>(`${API_URL}/leaderboards/${lbId}`);
  }

  computeLeaderboard(
    lbId: number,
    userLbId: number,
    viewId: number,
    pageNumber?: number,
  ): Observable<PageResponse<CalculationResponse>> {
    let params = new HttpParams();

    if (pageNumber !== undefined) {
      params = params.set('page', pageNumber.toString());
    }

    const computeUrl = `${this.apiUrl}/${lbId}/members/${userLbId}/views/${viewId}/compute`;

    return this.http.get<PageResponse<CalculationResponse>>(computeUrl, { params });
  }
}
