import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ExperienceService } from '@services/experience.service'
import { PoiService } from '@services/poi.service'
import { of, Subscription } from 'rxjs'
import { flatMap, take } from 'rxjs/operators'
import { MatSnackBar, MatDialog, MatMenuTrigger } from '@angular/material'
import { CreatingPointOfInterest, PointOfInterest } from '@models/place'
import { PlaceTypeService } from '@services/place-type.service'
import { PoiTypeLibraryComponent } from '../poi-type-library/poi-type-library.component'
import { PlaceType } from '@common/point-of-interest'
import { Media } from '@models/media'

@Component({
  selector: 'app-poi-create',
  templateUrl: './poi-create.component.html',
  styleUrls: ['./poi-create.component.scss'],
})
export class PoiCreateComponent implements OnInit, OnDestroy {

  @ViewChild(MatMenuTrigger, {static: true})
  contextMenu: MatMenuTrigger

  contextMenuPosition = { x: '0px', y: '0px' }

  public isEditing: boolean = false
  public paramsSubscription: Subscription
  public editOrCreateSubscription: Subscription
  public types: PlaceType[]
  public media: Media[] = []

  // The map will populate this object with the real geo data, the starting lat/lng is ignored
  private creatingPointOfInterest: CreatingPointOfInterest = new CreatingPointOfInterest({
    type: 'circle',
    lat: 0, lng: 0,
    radius: 100,
    colour: '#000000',
  })
  public poiForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    colour: [this.creatingPointOfInterest.triggerZone.colour],
    type: [undefined, [Validators.required]],
  })
  public editingPoi: PointOfInterest

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private experienceService: ExperienceService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private placeTypeService: PlaceTypeService,
    private poiService: PoiService,
  ) {
  }

  ngOnInit(): void {
    this.placeTypeService.getList().subscribe(types => {
      this.types = types
    })

    this.paramsSubscription = this.activatedRoute.params.pipe(
      flatMap(params => params.id ? of(this.poiService.getById(params.id)) : of(undefined)),
    ).subscribe((poi: PointOfInterest) => {
      console.log('Editing POI', poi)
      if (poi) {
        this.isEditing = true
        this.editingPoi = poi
        this.media = poi.media
        this.creatingPointOfInterest = new CreatingPointOfInterest(
          { ...poi.triggerZone },
          poi.id)
        this.creatingPointOfInterest.setAllLatLng(poi.lat, poi.lng)
        this.poiForm.patchValue({
          name: poi.name,
          colour: poi.triggerZone.colour,
          type: poi.placeType,
        })
        console.log('PlaceTypes', poi.placeType)
      }
      this.poiService.setCreatingPoi(this.creatingPointOfInterest)
    })
    // this.poiService.setCreatingPoi(this.creatingPointOfInterest)
  }

  afterContentChecked(): void {
  }

  ngOnDestroy(): void {
    this.poiService.setCreatingPoi(undefined)
    if (this.paramsSubscription && !this.paramsSubscription.closed) {
      this.paramsSubscription.unsubscribe()
    }
  }

  colourChanged($event: any): void {
    this.poiForm.get('colour')!.patchValue($event)
    this.creatingPointOfInterest.triggerZone.colour = $event
  }

  get selectedColor(): void {
    return this.poiForm.get('colour')!.value
  }

  get selectedType(): PlaceType {
    return this.poiForm.get('type').value
  }

  valid(): boolean {
    return this.hasSetLocation() && this.poiForm.valid
  }

  hasSetLocation(): boolean {
    return this.creatingPointOfInterest !== undefined && this.creatingPointOfInterest.isPopulated()
  }

  onSubmit(): void {
    if (!this.creatingPointOfInterest.lat || !this.creatingPointOfInterest.lng) {
      throw new Error('A location must be set for this new POI')
    }

    const experienceId = this.experienceService.getSelectedExperienceId()
    if (!this.isEditing) {
      const newPoi = new PointOfInterest(
        '', // Server will decide the ID
        this.poiForm.get('name')!.value,
        this.creatingPointOfInterest.lat,
        this.creatingPointOfInterest.lng,
        { ...this.creatingPointOfInterest.triggerZone },
        this.poiForm.get('type').value,
        this.media)
      console.log('newPoi is', newPoi)
      this.editOrCreateSubscription = this.poiService.addNewPointOfInterest(
        experienceId,
        newPoi,
      ).subscribe(poi => {
        this.snackBar.open('Point of Interest created. Click it on the map to edit.', undefined, {
          duration: 5000,
        })
        this.router.navigate(['/'])
      })
    } else if (this.creatingPointOfInterest.id) {
      const editedPoi = new PointOfInterest(
        this.creatingPointOfInterest.id,
        this.poiForm.get('name')!.value,
        this.creatingPointOfInterest.lat,
        this.creatingPointOfInterest.lng,
        { ...this.creatingPointOfInterest.triggerZone },
        this.poiForm.get('type').value,
        this.media,
      )
      this.poiService.editPointOfInterest(experienceId, editedPoi).subscribe(poi => {
        this.snackBar.open(editedPoi.name + ' edited', undefined, {
          duration: 5000,
        })
        this.router.navigate(['/'])
      })
    }
  }

  openPlaceTypeLibrary(): void {
    this.dialog.open(PoiTypeLibraryComponent, {
      width: '300px',
      disableClose: false,
    })
  }

  compareFn(t1: PlaceType, t2: PlaceType): boolean {
    return t1 !== undefined && t2 !== undefined
      ? t1._id === t2._id || t1.name === t2.name : t1 === t2
  }

  deletePlace(): void {
    if (!this.editingPoi) {
      throw new Error('Must be editing to delete')
    }
    // tslint:disable-next-line:max-line-length
    if (confirm('Are you sure you want to delete this place? Any associated media will be kept in your media library.')) {
      this.poiService.deletePoi(
        this.editingPoi.id,
      )
      .pipe(
        take(1),
      ).subscribe(() => {
        this.snackBar.open(this.editingPoi.name + ' deleted', undefined, {
          duration: 5000,
        })
        this.router.navigate(['/'])
      })
    }
  }

  // openMediaAttacher(): void {
  //   this.dialog.open(MediaAttacherComponent, {
  //     width: '400px',
  //     // height: '800px',
  //     data: {
  //       dataKey: this.editingPoi,
  //     },
  //   })
  // }
  onContextMenu(event: MouseEvent, item: PlaceType): void {
    // Cant delete default PlaceTypes
    if (item._id) {
      event.preventDefault()
      this.contextMenuPosition.x = event.clientX + 'px'
      this.contextMenuPosition.y = event.clientY + 'px'
      this.contextMenu.menuData = { item }
      this.contextMenu.openMenu()
    }
  }

  deletePlaceType(item: PlaceType): void {
    this.placeTypeService.delete(item._id).subscribe(() => {
      this.types = this.types.filter(type => type._id !== item._id)
    })
  }
}
