import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CollaborationService } from '@services/collaboration.service'
import { ExperienceService } from '@services/experience.service'
import { Observable, Subscription } from 'rxjs'
import { UserService } from '@services/user.service'
import { map, take } from 'rxjs/operators'
import { PublicProfile, ExperienceData } from '@common/experience'

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.scss'],
})
export class CollaboratorsComponent implements OnInit, OnDestroy {

  public form: FormGroup
  public $collaborators: Observable<any>
  public $myUserId: Observable<string>
  public collaborators: PublicProfile[]

  public selectedExperience: ExperienceData

  public susbcription: Subscription

  constructor(
    private fb: FormBuilder,
    private collaborationService: CollaborationService,
    private experienceService: ExperienceService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: ['', [Validators.required]],
    })

    this.selectedExperience = this.experienceService.getSelectedExperienceObj()

    this.susbcription = this.collaborationService.getForExperience(
      this.selectedExperience._id,
    ).subscribe(profiles =>
      this.collaborators = profiles,
    )
    this.$myUserId = this.userService.getMyProfile().pipe(
      map(profile => profile.id),
    )
  }

  ngOnDestroy(): void {
    this.susbcription.unsubscribe()
  }

  submit(): void {
    this.collaborationService.addUserToExperience(
      this.selectedExperience._id,
      this.form.get('userId')!.value,
    )
    .pipe(take(1))
    .subscribe(resp => {
      this.collaborators = resp
      this.form.reset()
      console.log(resp)
    })
  }

  removeCollaborator(userId: string): void {
    this.collaborationService.removeFromExperience(
      this.selectedExperience._id,
      userId,
    )
    .pipe(take(1))
    .subscribe(resp => {
      this.collaborators = resp
      console.log(resp)
    })
  }
}
