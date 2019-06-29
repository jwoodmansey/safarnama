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
}
