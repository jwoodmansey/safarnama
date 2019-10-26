import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'
import { UserData } from '@common/user'

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  public url = `${environment.api.url}admin`

  constructor(
    private http: HttpClient,
  ) { }

  getUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.url}/users`)
  }

  // TODO define types for experience snapshots
  getPublishedExperiences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/published-experiences`)
  }

  setAsExperienceAsFeatured(experienceId: string, feature: boolean = true): Observable<any> {
    if (feature) {
      return this.http.post<any>(`${this.url}/published-experiences/${experienceId}/feature`, null)
    }
    return this.http.delete<any>(`${this.url}/published-experiences/${experienceId}/feature`)
  }
}
