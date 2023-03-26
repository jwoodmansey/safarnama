import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExperienceService } from '@services/experience.service';

@Component({
  selector: 'app-export-experience-dialog',
  templateUrl: './export-experience-dialog.component.html',
  styleUrls: ['./export-experience-dialog.component.scss']
})
export class ExportExperienceDialogComponent implements OnInit {

  public isExporting = false

  constructor(
    public dialogRef: MatDialogRef<ExportExperienceDialogComponent>,
    public experienceService: ExperienceService
  ) { }

  ngOnInit(): void {
  }

  async export(): Promise<void> {
    if (this.isExporting) return

    this.isExporting = true
    try {
      await this.experienceService.exportExperience(
        this.experienceService.getSelectedExperienceId(),
      )
    } finally {
      this.isExporting = false
    }
  }

  cancel(): void {
    this.dialogRef.close()
  }
}
