import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectData } from '@common/project';
import { environment } from 'environments/environment';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, share, tap, withLatestFrom } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly PROJECT_URL = environment.api.url + 'project'
  private refreshObservable: Subject<ProjectData> = new Subject()

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  public getList(): Observable<(ProjectData & { isAdmin: boolean })[]> {
    return this.http.get(`${this.PROJECT_URL}/mine`).pipe(
      withLatestFrom(this.userService.getUserId()),
      map(([projects, userId]: [ProjectData[], string]) =>
        projects.map(p => ({ ...p, isAdmin: p.members?.find(m => m.roles.includes('admin') && m.userId === userId) !== undefined }))
      ),
      catchError(() => of([])),
      tap(types => console.log('Types got:', types)),
      share())
  }

  public getListAdmin(): Observable<ProjectData[]> {
    return this.getList().pipe(
      tap(([, userId]) => console.log(userId)),
      map((projects) =>
        projects.filter(p => p.isAdmin)
      )
    )
  }

  public getById(id: string): Observable<ProjectData> {
    return merge(
      this.refreshObservable.pipe(filter(p => p._id === id)),
      this.http.get<ProjectData>(`${this.PROJECT_URL}/${id}`).pipe(
        catchError(() => of(undefined)),
        share()
      ))
  }

  public setRole(id: string, userId: string, role: string): Observable<ProjectData> {
    return this.http.put(`${this.PROJECT_URL}/${id}/member/${userId}/${role}`, {}).pipe(
      catchError(() => of(undefined)),
      tap((project) => this.refreshObservable.next(project)),
      share()
    )
  }

  public removeRole(id: string, userId: string, role: string): Observable<ProjectData> {
    return this.http.delete(`${this.PROJECT_URL}/${id}/member/${userId}/${role}`, {}).pipe(
      catchError(() => of(undefined)),
      tap((project) => this.refreshObservable.next(project)),
      share()
    )
  }

  public edit(id: string, edit: Partial<ProjectData>): Observable<ProjectData> {
    return this.http.put(`${this.PROJECT_URL}/${id}`, edit).pipe(
      catchError(() => of(undefined)),
      tap((project) => this.refreshObservable.next(project)),
      share()
    )
  }
}
