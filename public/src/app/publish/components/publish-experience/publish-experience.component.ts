import { Component, OnInit } from '@angular/core'
import { ExperienceService } from '@services/experience.service'
import { ExperienceSnapshotData } from '@common/experience'
import { Subscription, combineLatest } from 'rxjs'
import deepEqual = require('deep-equal')
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'app-publish-experience',
  templateUrl: './publish-experience.component.html',
  styleUrls: ['./publish-experience.component.scss'],
})
export class PublishExperienceComponent implements OnInit {

  public experienceId: string
  public publishedUrl: string | undefined
  public latestSnapshot: ExperienceSnapshotData
  public latestSnapshotSubscription: Subscription
  public outstandingChanges: boolean = false

  constructor(
    public dialogRef: MatDialogRef<PublishExperienceComponent>,
    private experienceService: ExperienceService) { }

  ngOnInit(): void {
    this.experienceId = this.experienceService.getSelectedExperienceId()
    if (this.experienceId) {
      // this.publishedUrl =
      //   `${window.location.origin}/download/${this.experienceService.getSelectedExperienceId()}`
      const id = this.experienceService.getSelectedExperienceId()
      this.latestSnapshotSubscription =
        combineLatest(
          this.experienceService.getSelectedExperience(),
          this.experienceService.getLatestPublishedSnapshot(id),
        ).subscribe(([exp, snapshot]) => {
          this.latestSnapshot = snapshot

          this.publishedUrl = snapshot.metaData.shortLink

          // Todo there's a bit more work to do to calculate if there are changes,
          // the experiences in the service do not hold onto poi or other entity changes
          this.outstandingChanges = !deepEqual(exp, snapshot.data)
          console.log('', this.outstandingChanges)
        })
    } else {
      throw new Error('No experience selected')
    }
  }

  // checkIfChangesToPublish(exp: ExperienceData, snapshot: ExperienceSnapshotData): boolean {
  //   return deepEqual(exp, snapshot.data)
  // }

  publish(): void {
    this.experienceService.publishExperience(this.experienceId).subscribe(snapshot => {
      if (this.latestSnapshot) {
        this.dialogRef.close()
      }
      this.latestSnapshot = snapshot
    })
  }

  cancel(): void {
    this.dialogRef.close()
  }
}
