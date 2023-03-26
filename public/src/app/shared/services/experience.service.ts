import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ExperienceData, ExperienceSnapshotData } from '@common/experience'
import { BehaviorSubject, from, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { environment } from '../../../environments/environment'
import { PoiService } from './poi.service'
import { RouteService } from './route.service'
import JsFileDownloader from 'js-file-downloader';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {

  private lastOpenedExpereince = 'LAST_OPENED'
  private EXPERIENCE_URL = environment.api.url + 'experience'

  private selectedExperience: ExperienceData | undefined
  private selectedExperienceObservable: BehaviorSubject<ExperienceData | undefined> =
    new BehaviorSubject(undefined)

  constructor(
    private http: HttpClient,
    private routeService: RouteService,
    private poiService: PoiService
  ) { }

  getExperience(id: string): Observable<ExperienceData> {
    return this.http.get<ExperienceData>(this.EXPERIENCE_URL, { withCredentials: true })
  }

  setSelectedExperience(experience: ExperienceData): void {
    this.selectedExperience = experience
    this.selectedExperienceObservable.next(experience)
    this.poiService.poisLoaded(experience.pointOfInterests ? experience.pointOfInterests : [])
    this.routeService.routesLoaded(experience.routes ? experience.routes : [])
    this.setLastOpenedExperienceId(experience._id)
  }

  getSelectedExperience(): Observable<ExperienceData> {
    return this.selectedExperienceObservable.asObservable()
  }

  getSelectedExperienceObj(): ExperienceData {
    return {
      ...this.selectedExperience,
    }
  }

  getSelectedExperienceId(): string | undefined {
    if (this.selectedExperience) {
      return this.selectedExperience._id
    }
    return undefined
  }

  createExperience(experience: ExperienceData): Observable<ExperienceData> {
    return this.http.post<ExperienceData>(
      this.EXPERIENCE_URL,
      experience, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    })
  }

  cloneExperience(id: string, name: string): Observable<ExperienceData> {
    return this.http.post<ExperienceData>(
      `${this.EXPERIENCE_URL}/${id}/clone`,
      { name }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    })
  }

  exportExperience(id: string): Observable<void> {
    return from(new JsFileDownloader({url:`${this.EXPERIENCE_URL}/${id}/export`}))
  }

  editExperience(id: string, name: string, description?: string): Observable<ExperienceData> {
    return this.http.put<ExperienceData>(
      `${this.EXPERIENCE_URL}/${id}`,
      { name, description }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap(exp => {
        // Don't lose the POIs
        if (this.selectedExperience._id === exp._id) {
          this.selectedExperience = {
            ...exp,
            pointOfInterests: this.selectedExperience.pointOfInterests,
          }
          this.selectedExperienceObservable.next(this.selectedExperience)
        }
      }),
    )
  }

  publishExperience(id: string): Observable<ExperienceSnapshotData> {
    return this.http.post<ExperienceSnapshotData>(
      `${this.EXPERIENCE_URL}/${id}/publish`, {}).pipe(
        tap(snapshot => {
          console.log('Published experience, snapshot:', snapshot)
        }),
      )
  }

  unPublishExperience(id: string): Observable<any> {
    return this.http.post(
      `${this.EXPERIENCE_URL}/${id}/unpublish`, {}).pipe(
        tap(resp => {
          console.log('Unpublished experience, snapshot:', resp)
        }),
      )
  }

  getLatestPublishedSnapshot(id: string): Observable<ExperienceSnapshotData | undefined> {
    return this.http.get<ExperienceSnapshotData>(
      `${this.EXPERIENCE_URL}/${id}/snapshot`).pipe(
        // catchError(error => {
        //   if (error instanceof HttpErrorResponse && error.status === 404) {
        //     return of(undefined)
        //   }
        //   return throwError(error)
        // }),
      )
  }

  getLastOpenedExperienceId(): string | undefined {
    const lastId = localStorage.getItem(this.lastOpenedExpereince)
    return lastId && lastId.length > 0 ? lastId : undefined
  }

  private setLastOpenedExperienceId(id: string): void {
    localStorage.setItem(this.lastOpenedExpereince, id)
  }
}
