import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageResponse } from '../../model/page-response.model';

export interface MetricRequest {
  name: string;
  description: string;
}

export interface CreateMetricRequest{
  name: string;
  description: string;
  sort: Sort;
  position: number;
}

export interface MetricResponse {
  id: number;
  name: string;
  description: string;
}

export interface ViewMetricConfigRequest {
  sort: Sort;
  position: number;
}

export interface ViewMetricConfigResponse {
  id: number;
  metricId: number;
  sort: Sort;
  position: number;
}

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Injectable({
  providedIn: 'root',
})
export class MetricService {
  constructor(private readonly http: HttpClient) {}

  listMetrics(lbId: number, pageNumber?: number): Observable<PageResponse<MetricResponse>> {
    let params = new HttpParams();

    if (pageNumber !== undefined) {
      params = params.set('page', pageNumber.toString());
    }

    return this.http.get<PageResponse<MetricResponse>>(`${API_URL}/leaderboards/${lbId}/metrics`, {
      params,
    });
  }

  getMetric(lbId: number, metricId: number): Observable<MetricResponse> {
    return this.http.get<MetricResponse>(`${API_URL}/leaderboards/${lbId}/metrics/${metricId}`);
  }

  getViewMetricConfig(
    lbId: number,
    userLbId: number,
    viewId: number,
    viewMetricConfigId: number,
  ): Observable<ViewMetricConfigResponse> {
    return this.http.get<ViewMetricConfigResponse>(
      `${API_URL}/leaderboards/${lbId}/members/${userLbId}/views/${viewId}/metrics/configs/${viewMetricConfigId}`,
    );
  }

  listViewMetricConfigs(
    lbId: number,
    userLbId: number,
    viewId: number,
    pageNumber?: number,
  ): Observable<PageResponse<ViewMetricConfigResponse>> {
    let params = new HttpParams();

    if (pageNumber !== undefined) {
      params = params.set('page', pageNumber.toString());
    }

    return this.http.get<PageResponse<ViewMetricConfigResponse>>(
      `${API_URL}/leaderboards/${lbId}/members/${userLbId}/views/${viewId}/metrics/configs`,
      { params },
    );
  }

  metricExists(name: string, lbId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${API_URL}/leaderboards/${lbId}/metrics/metric-exists?name=${encodeURIComponent(name)}`,
    );
  }

  createMetric(request: CreateMetricRequest, lbId: number): Observable<MetricResponse>{
      return this.http.post<MetricResponse>(`${API_URL}/leaderboards/${lbId}/metrics`,request);
  }

  updateMetric(request: CreateMetricRequest, lbId: number, metricId: number): Observable<MetricResponse>{
      return this.http.patch<MetricResponse>(`${API_URL}/leaderboards/${lbId}/metrics/${metricId}`,request);
  }

  deleteMetric(lbId: number, metricId: number): Observable<void>{
      return this.http.delete<void>(`${API_URL}/leaderboards/${lbId}/metrics/${metricId}`);
  }
}
