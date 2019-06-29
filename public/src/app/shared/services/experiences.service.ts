import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { HttpClient } from '@angular/common/http'
import { ExperienceData } from '@common/experience'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ExperiencesService {

  private EXPERIENCE_URL = environment.api.url + 'experiences'
  private URL_GET_ALL = this.EXPERIENCE_URL + '/mine'

  constructor(private http: HttpClient) { }

  getMyExperiences(): Observable<ExperienceData[]> {
    return this.http.get<ExperienceData[]>(this.URL_GET_ALL, { withCredentials: true })
  }
}
