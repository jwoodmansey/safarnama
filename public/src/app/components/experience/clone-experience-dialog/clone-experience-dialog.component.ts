import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExperienceService } from '@services/experience.service';

@Component({
  selector: 'app-clone-experience-dialog',
  templateUrl: './clone-experience-dialog.component.html',
  styleUrls: ['./clone-experience-dialog.component.scss']
})
export class CloneExperienceDialogComponent implements OnInit {

  public form: FormGroup

  constructor(
    private fb: FormBuilder,
    private experienceService: ExperienceService,
    private dialogRef: MatDialogRef<CloneExperienceDialogComponent>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
    })
  }

  submit() {
    this.experienceService.cloneExperience(
      this.experienceService.getSelectedExperienceId(),
      this.form.get('name').value,
    ).subscribe((experienceData) => {
      this.dialogRef.close()
      this.experienceService.setSelectedExperience(experienceData)
      this.snackBar.open('Experience cloned')
    })
  }
}
