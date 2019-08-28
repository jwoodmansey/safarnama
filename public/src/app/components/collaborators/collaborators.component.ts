import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CollaborationService } from '@services/collaboration.service'
import { ExperienceService } from '@services/experience.service'
import { Observable } from 'rxjs'
import { UserService } from '@services/user.service'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.scss'],
})
export class CollaboratorsComponent implements OnInit {

  public form: FormGroup
  public $collaborators: Observable<any>
  public $myUserId: Observable<string>

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

    this.$collaborators = this.collaborationService.getForExperience(
      this.experienceService.getSelectedExperienceId(),
    )
    this.$myUserId = this.userService.getMyProfile().pipe(
      map(profile => profile.id),
    )
  }

  submit(): void {
    this.collaborationService.addUserToExperience(
      this.experienceService.getSelectedExperienceId(),
      this.form.get('userId')!.value,
    ).subscribe(resp => {
      console.log(resp)
    })
  }
}
