import { Component, OnInit } from '@angular/core'
import { ExperienceService } from '@services/experience.service'
import { ExperienceSnapshotData } from '@common/experience'
import { Subscription, combineLatest } from 'rxjs'
import deepEqual = require('deep-equal')
import { MatDialogRef } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-publish-experience',
  templateUrl: './publish-experience.component.html',
  styleUrls: ['./publish-experience.component.scss'],
})
export class PublishExperienceComponent implements OnInit, OnDestroy {

  public experienceId: string
  // public publishedUrl: string | undefined
  public latestSnapshot: ExperienceSnapshotData
  public latestSnapshotSubscription: Subscription
  public outstandingChanges: boolean = false
  public loading: boolean = true

  constructor(
    public dialogRef: MatDialogRef<PublishExperienceComponent>,
    private experienceService: ExperienceService,
  ) { }

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
        ).subscribe(
          ([exp, snapshot]) => {
            this.latestSnapshot = snapshot

            // this.publishedUrl =
            this.loading = false

          // Todo there's a bit more work to do to calculate if there are changes,
          // the experiences in the service do not hold onto poi or other entity changes
            this.outstandingChanges = !deepEqual(exp, snapshot.data)
            console.log('', this.outstandingChanges)
          },
          error => {
            if (error instanceof HttpErrorResponse && error.status === 404) {
              this.loading = false
            } else {
              alert(JSON.stringify(error))
            }
          })
    } else {
      throw new Error('No experience selected')
    }
  }

  ngOnDestroy(): void {
    if (this.latestSnapshotSubscription && !this.latestSnapshotSubscription.closed) {
      this.latestSnapshotSubscription.unsubscribe()
    }
  }

  // checkIfChangesToPublish(exp: ExperienceData, snapshot: ExperienceSnapshotData): boolean {
  //   return deepEqual(exp, snapshot.data)
  // }

  publish(): void {
    this.experienceService.publishExperience(this.experienceId)
    .pipe(take(1))
    .subscribe(snapshot => {
      this.latestSnapshot = snapshot
    })
  }

  unpublish(): void {
    // tslint:disable-next-line:max-line-length
    if (confirm('Unpublishing this experience will disallow new users from downloading it. Users who have already downloaded it will still be able to view it.\n\nIf you decide to publish again, a new link will be generated.\n\nAre you sure you want to unpublish this experience?')) {
      this.experienceService.unPublishExperience(this.experienceId).pipe(take(1)).subscribe(
        () => {
          this.latestSnapshot = undefined
        },
        e => {
          alert('Experience could not be unpublished, pleas try again' + JSON.stringify(e))
        })
    }
  }
}
