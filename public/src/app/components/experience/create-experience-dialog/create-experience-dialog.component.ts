import { Component, OnInit } from '@angular/core'
import { MatDialogRef, MatDialog } from '@angular/material'
import { ExperienceService } from '@services/experience.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-experience-dialog',
  templateUrl: './create-experience-dialog.component.html',
  styleUrls: ['./create-experience-dialog.component.scss'],
})
export class CreateExperienceDialogComponent implements OnInit {

  public form: FormGroup

  constructor(
    private dialogService: MatDialog,
    public dialogRef: MatDialogRef<CreateExperienceDialogComponent>,
    public experienceService: ExperienceService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    })
  }

  ngOnInit(): void {
  }

  public submit(): void {
    if (this.form.valid) {
      this.experienceService.createExperience(
        {
          _id: undefined,
          name: this.form.get('name')!.value,
          description: this.form.get('description')!.value,
        }).subscribe((resp: any) => {
          this.experienceService.setSelectedExperience(resp)
          this.dialogService.closeAll()
        })
    }
  }

}
