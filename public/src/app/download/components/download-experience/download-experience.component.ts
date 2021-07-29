import { Component, OnInit } from '@angular/core'
import { ExperienceSnapshotData } from '@common/experience'
import { ExperienceService } from '@services/experience.service'

@Component({
  selector: 'app-download-experience',
  templateUrl: './download-experience.component.html',
  styleUrls: ['./download-experience.component.scss'],
})
export class DownloadExperienceComponent implements OnInit {

  public snapshot: ExperienceSnapshotData | undefined

  constructor(private experienceService: ExperienceService) { }

  ngOnInit(): void {
    const split = window.location.href.split('/')
    this.experienceService.getLatestPublishedSnapshot(split[split.length -1 ]).subscribe((snapshot) => {
      this.snapshot = snapshot
    })
  }

  get downloadUrl(): string {
    return window.location.href
  }
}
