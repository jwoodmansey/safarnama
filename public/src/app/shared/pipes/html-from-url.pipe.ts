import { Pipe, PipeTransform } from '@angular/core'
import { Observable, merge } from 'rxjs'

import { flatMap, filter } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Media } from '@models/media'
import { MediaService } from '@services/media.service'

@Pipe({
  name: 'htmlFromUrl',
})
export class HtmlFromUrlPipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private mediaService: MediaService,
  ) {

  }

  transform(mediaItem: Media, args?: any): Observable<any> {
    return merge(
      this.mediaService.onMediaChanged().pipe(
        filter(val => val.id === mediaItem.id),
        flatMap(item => this.getHttpFromUrl(item.url)),
      ),
      this.getHttpFromUrl(mediaItem.url),
    )
  }

  getHttpFromUrl(url: string): Observable<any> {
    return this.http.get(
      url,
      {
        responseType: 'text',
        headers: new HttpHeaders({ accept: 'text/html' }),
      })
  }
}
