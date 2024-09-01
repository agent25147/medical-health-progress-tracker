import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AddLogDto } from '../dto/addLog.dto';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl = `${environment.apiUrl}/log`;

  constructor(private http: HttpClient) { }

  addLog(log: AddLogDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, log);
  }

  getWeeklyTrendData() : Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
