import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExperienceService } from '@services/experience.service';

@Component({
  selector: 'app-translate-experience-dialog',
  templateUrl: './translate-experience-dialog.component.html',
  styleUrls: ['./translate-experience-dialog.component.scss']
})
export class TranslateExperienceDialogComponent implements OnInit {

  public form: FormGroup

  constructor(
    private fb: FormBuilder,
    private experienceService: ExperienceService,
    private dialogRef: MatDialogRef<TranslateExperienceDialogComponent>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // this.form = this.fb.group({
    //   name: ['', Validators.required],
    // })
  }

  submit() {
    this.experienceService.getSelectedExperienceId();
  }
}
