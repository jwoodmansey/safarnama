import { LatLngLiteral, MouseEvent } from '@agm/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Component, OnInit, AfterContentInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ExperienceData } from '@common/experience'
import { PromptExperienceDialogComponent } from
  '@components/experience/prompt-experience-dialog/prompt-experience-dialog.component'
import { LoginComponent } from '@components/user/login/login.component'
import { ExperienceService } from '@services/experience.service'
import { PoiService } from '@services/poi.service'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { ExperiencesService } from '@services/experiences.service'
import { Router } from '@angular/router'
import { MapService } from '@services/map.service'
import { RouteEditorService } from '@services/editors/route-editor.service'
import { PointOfInterest, CreatingPointOfInterest } from '@models/place'
import { RouteService } from '@services/route.service'
import { Route } from '@models/route'

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
  public $isEditingRoute: Observable<boolean>

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
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.$creatingPointOfInterest = this.poiService.getCreatingPoi().pipe(
      tap(poi => {
        console.log('tap', this.editingPoiId)
        // if (this.editingPoiId === undefined && poi !== undefined) {
        //   this.lat = poi.lat
        //   this.lng = poi.lng
        //   this.zoom = 14
        // }
        this.editingPoiId = poi ? poi.id : undefined
      }),
      tap(poi => console.log('editing poi', poi)),
    )
    this.$isEditingRoute = this.routeEditorService.isEditingRoute()
    this.goToUsersLocation()
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.getExperiences()
      this.selectedExperience = this.experienceService.getSelectedExperience()
      this.poiService.getAll().subscribe(allPois => {
        console.log('All poi array updated', allPois)
        this.pointsOfInterest = allPois
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
      navigator.geolocation.getCurrentPosition(loc => {
        this.mapService.setLatLngZoom(
          0,
          0,
          15)
        this.mapService.setLatLngZoom(
              loc.coords.latitude,
              loc.coords.longitude,
              15)
      })
    }
  }

  showExperienceDialog(): void {
    const dialogRef = this.dialog.open(PromptExperienceDialogComponent, {
      width: '250px',
      disableClose: true,
      // data: { name: this.name, animal: this.animal },
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
      // this.animal = result
    })
  }
  mapClicked($event: MouseEvent): void {
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

  mapReady($event): void {
    // this.addYourLocationButton($event, undefined)
  }

  // This isnt yet working
  addYourLocationButton(map, marker): void {
    console.log(map)
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

    // new GoogleMapsAPIWrapper().getNativeMap()
    // google.maps.event.addListener(map, 'center_changed', () => {
    //   secondChild.style['background-position'] = '0 0'
    // })

    firstChild.addEventListener('click', () => {
      let imgX = 0
      const animationInterval = setInterval(() => {
        imgX = -imgX - 18
        secondChild.style['background-position'] = imgX + 'px 0'
      },                                    500)

      console.log('CLICK')
      if (navigator.geolocation) {
        this.goToUsersLocation()
        clearInterval(animationInterval)
        secondChild.style['background-position'] = '-144px 0'

        // navigator.geolocation.getCurrentPosition(function (position) {
        // tslint:disable-next-line:max-line-length
        //   const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        //   map.setCenter(latlng)
        //   clearInterval(animationInterval)
        //   secondChild.style['background-position'] = '-144px 0'
        // })
      } else {
        clearInterval(animationInterval)
        secondChild.style['background-position'] = '0 0'
      }
    })

    // controlDiv = 1
    console.log(map.controls)
    map.controls[9].push(controlDiv)

  }
}
