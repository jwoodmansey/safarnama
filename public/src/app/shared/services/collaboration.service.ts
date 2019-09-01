import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { PublicProfile } from '@common/experience'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class CollaborationService {

  private EXPERIENCE_URL = environment.api.url + 'experience'

  constructor(
    private http: HttpClient,
  ) { }

  addUserToExperience(experienceId: string, userId: string): Observable<PublicProfile[]> {
    return this.http.post<{success: boolean, users: PublicProfile[]}>(
      this.getUrlForExperience(experienceId),
      { userIds: [userId] },
    ).pipe(
      map(resp => resp.users),
    )
  }

  removeFromExperience(experienceId: string, userId: string): Observable<PublicProfile[]> {
    return this.http.delete<PublicProfile[]>(
      `${this.getUrlForExperience(experienceId)}/${userId}`,
    )
  }

  getForExperience(experienceId: string): Observable<PublicProfile[]> {
    return this.http.get<PublicProfile[]>(this.getUrlForExperience(experienceId))
  }

  private getUrlForExperience(id: string): string {
    return `${this.EXPERIENCE_URL}/${id}/collaborator`
  }
}
