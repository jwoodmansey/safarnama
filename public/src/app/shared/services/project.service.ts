import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectData } from '@common/project';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, share, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly PROJECT_URL = environment.api.url + 'project'

  constructor(
    private http: HttpClient,
  ) { }

  public getList(): Observable<ProjectData[]> {
    return this.http.get<ProjectData[]>(`${this.PROJECT_URL}/mine`).pipe(
      catchError(() => of([])),
      tap(types => console.log('Types got:', types)),
      share())
  }
}
