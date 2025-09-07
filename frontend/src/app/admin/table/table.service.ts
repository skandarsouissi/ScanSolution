import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Table {
  id?: number;
  code: string;
  qrUrl?: string;
  qrBase64?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private apiUrl = 'http://localhost:8080/api/tables';

  constructor(private http: HttpClient) { }

  getAllTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }

  createTable(table: Table): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, table);
  }

  deleteTable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
