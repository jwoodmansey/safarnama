import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { HttpClient } from '@angular/common/http'
import { ExperienceData, ExperienceResponseData } from '@common/experience'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root',
})
export class ExperiencesService {

  private EXPERIENCE_URL = environment.api.url + 'experiences'
  private URL_GET_ALL = this.EXPERIENCE_URL + '/mine'

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { }

  getMyExperiences(): Observable<ExperienceData[]> {
    return this.http.get<ExperienceResponseData>(
      this.URL_GET_ALL, { withCredentials: true },
    ).pipe(
      tap(resp => this.userService.setUserId(resp.forUserId)),
      map(resp => resp.data),
    )
  }
}
