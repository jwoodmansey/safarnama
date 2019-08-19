import { Injectable } from '@angular/core'
import { Observable   , Subject, merge, of } from 'rxjs'
import { environment } from 'environments/environment'
import { HttpClient } from '@angular/common/http'
import { tap, map, flatMap, share, catchError } from 'rxjs/operators'
import { PlaceType } from '@common/point-of-interest'

@Injectable({
  providedIn: 'root',
})
export class PlaceTypeService {

  private readonly PLACE_URL = environment.api.url + 'place-types'

  // These will only be used as values, so dont need ids
  // User created ones are given ids in case we ever want to edit/delete them in the future
  private readonly DEFAULT_TYPES: PlaceType[] = [
    {
      name: 'Monument',
      matIcon: 'place',
      _id: undefined,
      ownerId: undefined,
    },
    {
      name: 'Lake',
      matIcon: 'bubble_chart',
      _id: undefined,
      ownerId: undefined,
    },
    {
      name: 'Private building',
      matIcon: 'account_balance',
      _id: undefined,
      ownerId: undefined,
    },
    {
      name: 'Vanished place',
      matIcon: 'border_bottom',
      _id: undefined,
      ownerId: undefined,
    },
    {
      name: 'Person',
      matIcon: 'person_pin_circle',
      _id: undefined,
      ownerId: undefined,
    },
  ]

  private refreshObservable: Subject<boolean> = new Subject()

  constructor(
    private http: HttpClient,
  ) { }

  public getList(): Observable<PlaceType[]> {
    // A merge here allows us to force a refresh when creating a new place
    return merge(
      this.refreshObservable.pipe(flatMap(() => this.getListFromApi())),
      this.getListFromApi(),
    )
  }

  private getListFromApi(): Observable<PlaceType[]>  {
    return this.http.get<PlaceType[]>(`${this.PLACE_URL}/mine`).pipe(
      catchError(() => of([])),
      map(types => [...this.DEFAULT_TYPES, ...types]),
      tap(types => console.log('Types got:', types)),
      share(),
    )
  }

  public create(type: PlaceType): Observable<PlaceType> {
    return this.http.post<PlaceType>(this.PLACE_URL, type)
      .pipe(
        tap(createdType  => {
          this.refreshObservable.next(true)
        }),
      )
  }
}
