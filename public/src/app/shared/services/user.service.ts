import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'environments/environment'
import { PublicProfile } from '@common/experience'
import { Observable, BehaviorSubject } from 'rxjs'
import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private USER_URL = environment.api.url + 'user'
  private $userId: BehaviorSubject<string | undefined> = new BehaviorSubject(undefined)

  constructor(private http: HttpClient) { }

  public getMyProfile(): Observable<PublicProfile> {
    return this.http.get<PublicProfile>(this.USER_URL)
  }

  public editProfile(id: string, edit: { bio?: string }): Promise<void> {
    return this.http.put<void>(
      `${this.USER_URL}/${id}`,
      edit,
    ).pipe(take(1)).toPromise()
  }

  getUserId(): Observable<string> {
    return this.$userId.asObservable()
  }

  setUserId(id: string): void {
    this.$userId.next(id)
  }
}
