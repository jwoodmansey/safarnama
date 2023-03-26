import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExperienceService } from '@services/experience.service';

@Component({
  selector: 'app-export-experience-dialog',
  templateUrl: './export-experience-dialog.component.html',
  styleUrls: ['./export-experience-dialog.component.scss']
})
export class ExportExperienceDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ExportExperienceDialogComponent>,
    public experienceService: ExperienceService
  ) { }

  ngOnInit(): void {
  }

  export(): void {
    this.experienceService.exportExperience(
      this.experienceService.getSelectedExperienceId(),
    ).subscribe(() => {
      
    })
  }

  cancel(): void {
    this.dialogRef.close()
  }
}
