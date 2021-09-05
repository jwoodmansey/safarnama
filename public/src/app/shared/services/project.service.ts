import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectData } from '@common/project';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, share, tap, withLatestFrom } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly PROJECT_URL = environment.api.url + 'project'

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  public getList(): Observable<ProjectData[]> {
    return this.http.get<ProjectData[]>(`${this.PROJECT_URL}/mine`).pipe(
      catchError(() => of([])),
      tap(types => console.log('Types got:', types)),
      share())
  }

  public getListAdmin(): Observable<ProjectData[]> {
    return this.getList().pipe(
      withLatestFrom(this.userService.getUserId()),
      tap(([,userId]) =>console.log(userId)),
      map(([projects, userId]) =>
        projects.filter(p => p.members?.find(m => m.roles.includes('admin') && m.userId === userId) !== undefined)
      )
    )
  }
}
