import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExperienceData } from '@common/experience'
import { ExperiencesService } from '@services/experiences.service'
import { ExperienceService } from '@services/experience.service'

@Component({
  selector: 'app-open-experience-dialog',
  templateUrl: './open-experience-dialog.component.html',
  styleUrls: ['./open-experience-dialog.component.scss'],
})
export class OpenExperienceDialogComponent implements OnInit {

  public experiences: ExperienceData[] | undefined
  public selected: ExperienceData | undefined

  constructor(
    public dialogRef: MatDialogRef<OpenExperienceDialogComponent>,
    private dialogService: MatDialog,
    public experiencesService: ExperiencesService,
    public experienceService: ExperienceService) {
  }

  ngOnInit(): void {
    this.experiencesService.getMyExperiences().subscribe(experiences => {
      console.log('experiences', experiences)
      this.experiences = experiences
    },                                                   () => {

    })
  }

  cancel(): void {
    this.dialogRef.close()
  }

  open(): void {
    this.experienceService.setSelectedExperience(this.selected)
    this.dialogService.closeAll()
  }
}
