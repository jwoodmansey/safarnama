import { Pipe, PipeTransform } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Pipe({
  name: 'htmlFromUrl',
})
export class HtmlFromUrlPipe implements PipeTransform {

  constructor(private http: HttpClient) {

  }

  transform(url: string, args?: any): Observable<any> {
    return this.http.get(
      url,
      {
        responseType: 'text',
        headers: new HttpHeaders({ accept: 'text/html' }),
      })
  }

}
