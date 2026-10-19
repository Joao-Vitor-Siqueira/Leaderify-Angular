import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageResponse } from '../../model/page-response.model';

export interface EntryResponse{
  id: number,
  name: string,
  description: string
}

export interface EntryRequest{
  name: string,
  description: string
}


@Injectable({
  providedIn: 'root',
})
export class EntryService {
  constructor(private readonly http: HttpClient) {}

  listEntries(lbId: number, pageNumber?: number): Observable<PageResponse<EntryResponse>> {
      let params = new HttpParams();

      if (pageNumber !== undefined) {
        params = params.set('page', pageNumber.toString());
      }
      return this.http.get<PageResponse<EntryResponse>>(`${API_URL}/leaderboards/${lbId}/entries`, {
        params,
      });
    }

  getEntry(lbId: number, entryId: number): Observable<EntryResponse> {
      return this.http.get<EntryResponse>(`${API_URL}/leaderboards/${lbId}/entries/${entryId}`);
    }

  createEntry(request: EntryRequest, lbId: number): Observable<EntryResponse>{
        return this.http.post<EntryResponse>(`${API_URL}/leaderboards/${lbId}/entries`,request);
    }

  updateEntry(request: EntryRequest, lbId: number, entryId: number): Observable<EntryResponse>{
      return this.http.patch<EntryResponse>(`${API_URL}/leaderboards/${lbId}/entries/${entryId}`,request);
  }

  deleteEntry(lbId: number, entryId: number): Observable<void>{
      return this.http.delete<void>(`${API_URL}/leaderboards/${lbId}/entries/${entryId}`);
  }

  entryExists(name: string, lbId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${API_URL}/leaderboards/${lbId}/entries/entry-exists?name=${encodeURIComponent(name)}`,
    );
  }
}
