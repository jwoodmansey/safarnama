import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { PublicProfile } from '@common/experience'

@Injectable({
  providedIn: 'root',
})
export class CollaborationService {

  private EXPERIENCE_URL = environment.api.url + 'experience'

  constructor(
    private http: HttpClient,
  ) { }

  addUserToExperience(experienceId: string, userId: string): Observable<Object> {
    return this.http.post(`${this.EXPERIENCE_URL}/${experienceId}/collaborator`, {
      userIds: [userId],
    })
  }

  getForExperience(experienceId: string): Observable<PublicProfile[]> {
    return this.http.get<PublicProfile[]>(`${this.EXPERIENCE_URL}/${experienceId}/collaborator`)
  }
}
