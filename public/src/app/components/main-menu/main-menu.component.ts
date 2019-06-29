import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { PoiViewAllComponent } from '@components/poi/poi-view-all/poi-view-all.component'
import { MediaLibraryComponent } from '@components/media/media-library/media-library.component'
import { OpenExperienceDialogComponent } from '@components/experience/open-experience-dialog/open-experience-dialog.component'
import { CreateExperienceDialogComponent } from '@components/experience/create-experience-dialog/create-experience-dialog.component'
import { ExperienceService } from '@services/experience.service'
import { PublishExperienceComponent } from 'app/publish/components/publish-experience/publish-experience.component'

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private experienceService: ExperienceService) { }

  ngOnInit(): void {
  }

  viewAllPointsOfInterest(): void {
    this.dialog.open(PoiViewAllComponent, {
      width: '800px',
      disableClose: false,
    })
  }

  viewMediaLibrary(): void {
    this.dialog.open(MediaLibraryComponent, {
      width: '800px',
      disableClose: false,
    })
  }

  openExperience(): void {
    this.dialog.open(OpenExperienceDialogComponent, {
      width: '250px',
      disableClose: false,
    })
  }

  createNewExperience(): void {
    this.dialog.open(CreateExperienceDialogComponent, {
      width: '400px',
      disableClose: false,
    })
  }

  publish(): void {
    this.dialog.open(PublishExperienceComponent, {
      width: '400px',
      disableClose: false,
    })
  }

  get isExperienceOpen(): boolean {
    return this.experienceService.getSelectedExperienceId() !== undefined
  }
}
