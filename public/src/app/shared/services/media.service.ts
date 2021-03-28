import { Injectable } from '@angular/core'
import { Subject, merge, Observable } from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'
import { MediaDocument } from '@common/media'
import { map, flatMap, take, tap } from 'rxjs/operators'
import { Media } from '@models/media'
import { environment } from 'environments/environment'
import { ExperienceService } from './experience.service'

@Injectable({
  providedIn: 'root',
})
export class MediaService {

  private MEDIA_URL = environment.api.url + 'media'
  private MINE_URL = `${this.MEDIA_URL}/mine`
  private FILES_URL = `${this.MEDIA_URL}/files`

  private $refreshMedia: Subject<boolean> = new Subject()
  private $onMediaChanged: Subject<Media> = new Subject()

  constructor(
    private http: HttpClient,
    private experienceService: ExperienceService,
  ) { }

  getAll(): Observable<Media[]> {
    return merge(
      this.getAllFromAPI(),
      this.$refreshMedia.pipe(flatMap(() => this.getAllFromAPI())),
    ).pipe(
      tap(media => console.log(media)),
    )
  }

  private getAllFromAPI(): Observable<Media[]> {
    return this.http.get<MediaDocument[]>(
      this.MINE_URL,
    ).pipe(
      map(docs => docs.map(doc => new Media(doc))),
    )
  }

  public async create(file: File): Promise<Object> {
    const formData = new FormData()
    formData.append('filepond', file)
    const params = new HttpParams()
    const options = {
      params,
      reportProgress: true,
    }
    return this.http.post(
      `${this.MEDIA_URL}/process?expId=${this.experienceService.getSelectedExperienceId()}`,
      formData,
      options,
    ).pipe(take(1)).toPromise()
  }

  public async edit(
    id: string,
    edit: {
      name: string,
      acknowledgements: string,
      description: string,
      externalLinks: string[],
    }): Promise<MediaDocument> {
    console.log('Media item edited', edit)
    return this.http.put<MediaDocument>(
      `${this.FILES_URL}/${id}`,
      edit,
    ).pipe(take(1)).toPromise()
  }

  public async editText(
    media: Media,
    file: File): Promise<MediaDocument> {
    const formData = new FormData()
    formData.append('filepond', file)
    const params = new HttpParams()
    const options = {
      params,
      reportProgress: true,
    }
    return this.http.put<MediaDocument>(
      `${this.FILES_URL}/${media.id}`,
      formData,
      options,
    ).pipe(
      take(1),
      tap(() => this.mediaChanged(media)),
    ).toPromise()
  }

  public async delete(id: string): Promise<Object> {
    return this.http.delete(
      `${this.FILES_URL}/${id}`,
    ).pipe(take(1)).toPromise()
  }

  public triggerRefresh(): void {
    this.$refreshMedia.next()
  }

  private mediaChanged(item: Media): void {
    this.$onMediaChanged.next(item)
  }

  /**
   * Outputs whenever a media item changes
   */
  public onMediaChanged(): Observable<Media> {
    return this.$onMediaChanged.asObservable()
  }
}
