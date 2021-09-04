import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ExperienceService } from '@services/experience.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ProjectService } from '@services/project.service';
import { Subscription } from 'rxjs';
import { ProjectData } from '@common/project';

@Component({
  selector: 'app-create-experience-dialog',
  templateUrl: './create-experience-dialog.component.html',
  styleUrls: ['./create-experience-dialog.component.scss'],
})
export class CreateExperienceDialogComponent implements OnInit, OnDestroy {

  public form: FormGroup
  private projectSubscription: Subscription
  public projects: ProjectData[] = []

  constructor(
    private dialogService: MatDialog,
    public dialogRef: MatDialogRef<CreateExperienceDialogComponent>,
    public experienceService: ExperienceService,
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      project: [undefined],
    })
  }

  ngOnInit(): void {
    this.projectSubscription = this.projectService.getList().subscribe((data) => {
      this.projects = data
    })
  }

  ngOnDestroy(): void {
    if (this.projectSubscription && !this.projectSubscription.closed) {
      this.projectSubscription.unsubscribe()
    }
  }

  public submit(): void {
    console.log('SELECTED', this.form.getRawValue())
    if (this.form.valid) {
      this.experienceService.createExperience(
        {
          _id: undefined,
          name: this.form.get('name')!.value,
          description: this.form.get('description')!.value,
          projects: this.form.get('project') ? [this.form.get('project').value._id] : undefined,
        }).subscribe((resp: any) => {
          this.experienceService.setSelectedExperience(resp)
          this.dialogService.closeAll()
        })
    }
  }

}
