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
}
