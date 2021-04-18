import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterContentInit, Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExperienceData } from '@common/experience';
import { PromptExperienceDialogComponent } from '@components/experience/prompt-experience-dialog/prompt-experience-dialog.component';
import { LoginComponent } from '@components/user/login/login.component';
import { LatLngLiteral } from '@models/geo/LatLng';
import { CreatingPointOfInterest, PointOfInterest } from '@models/place';
import { Route } from '@models/route';
import { EditingRoute, RouteEditorService } from '@services/editors/route-editor.service';
import { ExperienceService } from '@services/experience.service';
import { ExperiencesService } from '@services/experiences.service';
import { MapService } from '@services/map.service';
import { PoiService } from '@services/poi.service';
import { RouteService } from '@services/route.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

type MouseEvent = {coords: LatLngLiteral}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, AfterContentInit {

  public selectedExperience: Observable<ExperienceData>
  public creatingPoi: boolean = false

  public pointsOfInterest: PointOfInterest[] = []
  public routes: Route[] = []

  public $creatingPointOfInterest: Observable<CreatingPointOfInterest | undefined>
  public editingPoiId: string | undefined = undefined
  public $editingRoute: Observable<EditingRoute | undefined>
  public editingRouteId: string | undefined = undefined

  public $lat: Observable<number> = this.mapService.getLat()
  public $lng: Observable<number> = this.mapService.getLng()
  public $zoom: Observable<number> = this.mapService.getZoom()

  public initialLocSet = false

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
    )

  constructor(private breakpointObserver: BreakpointObserver,
              private experienceService: ExperienceService,
              private experiencesService: ExperiencesService,
              private poiService: PoiService,
              private routeService: RouteService,
              private routeEditorService: RouteEditorService,
              private mapService: MapService,
              private _zone: NgZone,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.$creatingPointOfInterest = this.poiService.getCreatingPoi().pipe(
      tap(poi => {
        console.log('tap', this.editingPoiId)
        if (this.editingPoiId === undefined && poi !== undefined) {
          // AGM doesnt detect the update unless this is ran through a settimeout?
          // Likely a zone.js issue, revisit
          setTimeout(() => {
            this.mapService.setLatLngZoom(
                poi.lat,
                poi.lng,
                16)
          })
        }
        this.editingPoiId = poi ? poi.id : undefined
      }),
      tap(poi => console.log('editing poi', poi)),
    )
    this.$editingRoute = this.routeEditorService.getRoute()
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.getExperiences()
      this.selectedExperience = this.experienceService.getSelectedExperience()
      this.poiService.getAll().subscribe(allPois => {
        console.log('All poi array updated', allPois)
        this.pointsOfInterest = allPois

        if (this.pointsOfInterest.length === 0) {
          this.goToUsersLocation()
        }
      })
      this.routeService.getAll().subscribe(allRoutes => {
        console.log('All route array updated', allRoutes)
        this.routes = allRoutes
      })
    })
  }

  getExperiences(): void {
    this.experiencesService.getMyExperiences().subscribe(exps => {
      const last = this.experienceService.getLastOpenedExperienceId()
      if (last) {
        const lastData = exps.find(exp => exp._id === last)
        if (lastData) {
          this.experienceService.setSelectedExperience(lastData)
          return
        }
      }
      this.showExperienceDialog()
    },                                                   e => {
      console.log(e)
      // this will return a permissions error on first load, prompt user to log in
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '250px',
        disableClose: true,
        // data: { name: this.name, animal: this.animal },
      })

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed')
        // this.animal = result
      })
    })
  }

  goToUsersLocation(): void {
    if (navigator.geolocation) {
      this._zone.run(() => {
        navigator.geolocation.getCurrentPosition(loc => {
          this.mapService.setLatLngZoom(
            0,
            0,
            15)
          setTimeout(() => {
            this.mapService.setLatLngZoom(
                loc.coords.latitude,
                loc.coords.longitude,
                15)
          })
        })
      })
    }
  }

  showExperienceDialog(): void {
    const dialogRef = this.dialog.open(PromptExperienceDialogComponent, {
      width: '250px',
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
    })
  }
  mapClicked($event: MouseEvent): void {
    console.log('mapClicked', $event)
    if (this.poiService.isCreatingPoi()) {
      this.poiService.setInitialLatLng($event.coords.lat, $event.coords.lng)
    } else if (this.routeEditorService.isEditingRoutePrimitive()) {
      this.routeEditorService.addPoint($event.coords)
    }
  }

  public dragEnd($event: MouseEvent): void {
    const latLng = $event.coords
    this.poiService.updateCreatingTriggerLatLng(latLng.lat, latLng.lng)
  }

  public centerChanged(latLng: LatLngLiteral): void {
    this.poiService.updateCreatingPoiLatLng(latLng.lat, latLng.lng)
  }

  public radiusChanged(radius: number): void {
    this.poiService.updateCreatingPoiTriggerRadius(radius)
  }

  public markerClicked(poiId: string): void {
    this.router.navigate(['/poi/edit/' + poiId])
    console.log('Marker clicked', poiId)
  }

  public lineClicked(routeId: string): void {
    this.router.navigate(['/route/edit/' + routeId])
    console.log('Route clicked', routeId)
  }

  public get labelOptions(): any {
    return {
      color: 'white', text: '\e8be;', fontFamily: '\'Material Icons\'',
    }
  }

  mapReady(map): void {
    // this.addYourLocationButton()
    map.addListener('click', (e: any) => {
      console.log(e.latLng.lat(), e.latLng.lng());
  });
  }

  // This isnt yet working
  addYourLocationButton(map): void {
    const controlDiv = document.createElement('div')

    const firstChild = document.createElement('button')
    firstChild.style.backgroundColor = '#fff'
    firstChild.style.border = 'none'
    firstChild.style.outline = 'none'
    firstChild.style.width = '28px'
    firstChild.style.height = '28px'
    firstChild.style.borderRadius = '2px'
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'
    firstChild.style.cursor = 'pointer'
    firstChild.style.marginRight = '10px'
    firstChild.style.padding = '0'
    firstChild.title = 'Your Location'
    controlDiv.appendChild(firstChild)

    const secondChild = document.createElement('div')
    secondChild.style.margin = '5px'
    secondChild.style.width = '18px'
    secondChild.style.height = '18px'
    // tslint:disable-next-line:max-line-length
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)'
    secondChild.style.backgroundSize = '180px 18px'
    secondChild.style.backgroundPosition = '0 0'
    secondChild.style.backgroundRepeat = 'no-repeat'
    firstChild.appendChild(secondChild)
    firstChild.addEventListener('click', () => {
      if (navigator.geolocation) {
        this.goToUsersLocation()
      }
    })

    // controlDiv = 1
    console.log(map.controls)
    map.controls[9].push(controlDiv)

  }
}
