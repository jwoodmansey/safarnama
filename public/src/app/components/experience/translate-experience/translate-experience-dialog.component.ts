import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialogRef } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ExperienceService } from '@services/experience.service';

// type TranslationString = {
//   locale: string,
//   translation: string
// }

// type Translation = {
//   id: string
//   // base: string;
//   translations: TranslationString[],
// }

@Component({
  selector: 'app-translate-experience-dialog',
  templateUrl: './translate-experience-dialog.component.html',
  styleUrls: ['./translate-experience-dialog.component.scss']
})
export class TranslateExperienceDialogComponent implements OnInit {

  public form: FormGroup
  public data = new MatTableDataSource<any>()

  public displayedColumns: string[] = ['id']
  public baseLocale = 'enGB'

  constructor(
    private fb: FormBuilder,
    private experienceService: ExperienceService,
    // private dialogRef: MatDialogRef<TranslateExperienceDialogComponent>,
    // private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.displayedColumns = ['id', this.baseLocale, 'cyGB']

    this.experienceService.getSelectedExperience().subscribe((experienceData) => {
      this.data = new MatTableDataSource([
        {
          id: 'experience.name',
          [this.baseLocale]: experienceData.name,
        }, 
        {
          id: 'experience.description',
          [this.baseLocale]: experienceData.description,
        }
      ])
      this.form = this.fb.group(
        this.data.data.reduce((prev, curr) => ({
          ...prev,
          [curr.id]: ['', Validators.required]
      }), {}))
    })

  }

  submit() {
    this.experienceService.getSelectedExperienceId();
  }
}
