import { Component, OnInit, OnDestroy } from '@angular/core'
import { RouteEditorService } from '@services/editors/route-editor.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { RouteService } from '@services/route.service'
import { Route } from '@models/route'
import { ExperienceService } from '@services/experience.service'
import { LatLngLiteral } from '@agm/core'
import { Subscription, of } from 'rxjs'
import { flatMap, take } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'app-route-create',
  templateUrl: './route-create.component.html',
  styleUrls: ['./route-create.component.scss'],
})
export class RouteCreateComponent implements OnInit, OnDestroy {

  public isEditingId: string | undefined = undefined
  public coords: LatLngLiteral[] | undefined
  public paramsSubscription: Subscription

  public routeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    colour: ['#51D9A9'],
  })

  constructor(private routeEditorService: RouteEditorService,
              private routeService: RouteService,
              private experienceService: ExperienceService,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.paramsSubscription = this.activatedRoute.params.pipe(
      flatMap(params => params.id ? of(this.routeService.getById(params.id)) : of(undefined)),
      take(1),
    ).subscribe(route => {
      console.log('Editing Route', route)
      this.routeEditorService.startEditing(route)
      if (route) {
        this.isEditingId = route.id
        this.routeForm.patchValue({ name: route.name, colour: route.colour })
      }
    })
    this.routeEditorService.getRoute().subscribe(route => {
      if (route) {
        this.coords = route.getPoints()
      }
    })
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription && !this.paramsSubscription.closed) {
      this.paramsSubscription.unsubscribe()
    }
    this.routeEditorService.finishEditing()
  }

  colourChanged($event: any): void {
    this.routeForm.get('colour')!.patchValue($event)
    this.routeEditorService.setColour($event)
  }

  get selectedColor(): string {
    return this.routeForm.get('colour')!.value
  }

  valid(): boolean {
    return this.routeForm.valid && this.coords && this.coords.length > 1
  }

  onSubmit(): void {
    if (this.valid) {

      const experienceId = this.experienceService.getSelectedExperienceId()
      const route = new Route(
        this.isEditingId ? this.isEditingId : '',
        this.routeForm.get('name').value,
        this.coords,
        this.selectedColor,
        'None',
      )

      if (this.isEditingId) {
        this.routeService.edit(experienceId, route).subscribe(() => {
          this.routeEditorService.finishEditing()
          this.snackBar.open('Route edited', undefined, {
            duration: 5000,
          })
          this.router.navigate(['/'])
        })
      } else {
        this.routeService.add(experienceId, route).subscribe(() => {
          this.routeEditorService.finishEditing()
          this.snackBar.open('Route created. Click on the map to edit it.', undefined, {
            duration: 5000,
          })
          this.router.navigate(['/'])
        })
      }
    }
  }
}
