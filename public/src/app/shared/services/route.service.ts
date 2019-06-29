import { Injectable } from '@angular/core'
import { Route } from '@models/route'
import { Observable, BehaviorSubject } from 'rxjs'
import { environment } from 'environments/environment'
import { HttpClient  } from '@angular/common/http'
import { tap } from 'rxjs/operators'
import { RouteDocument } from '@common/route'

@Injectable({
  providedIn: 'root',
})
export class RouteService {

  private ROUTE_URL = environment.api.url + 'route'
  private allRoutes: Route[] = []
  private allRoutesObservable: BehaviorSubject<Route[]> = new BehaviorSubject<Route[]>([])

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Route[]> {
    return this.allRoutesObservable.asObservable()
  }

  public getById(id: string): Route | undefined {
    if (this.allRoutes) {
      return this.allRoutes.find(route => route.id === id)
    }
    return undefined
  }

  public routesLoaded(routes: RouteDocument[]): void {
    const objs = routes.map(route => Route.fromDocument(route))
    this.allRoutes = []
    this.allRoutes.push(...objs)
    this.allRoutesObservable.next(this.allRoutes)
  }

  public add(experienceId: string, route: Route): Observable<RouteDocument> {
    return this.http.post<RouteDocument>(
        this.ROUTE_URL,
        route.toDocument(experienceId),
      )
      .pipe(
        tap(createdRoute => {
          this.allRoutes.push(Route.fromDocument(createdRoute))
          this.allRoutesObservable.next(this.allRoutes)
        }),
    )
  }

  public edit(experienceId: string, route: Route): Observable<RouteDocument> {
    return this.http.put<RouteDocument>(
      `${this.ROUTE_URL}/${route.id}`,
      route.toDocument(experienceId),
    )
    .pipe(
      tap(editedRoute => {
        const idx = this.allRoutes.findIndex(poi => poi.id === editedRoute._id)
        this.allRoutes[idx] = Route.fromDocument(editedRoute)
        this.allRoutesObservable.next(this.allRoutes)
      }),
  )
  }

  public delete(routeId: string): void {
    throw new Error('Stub')
  }
}
