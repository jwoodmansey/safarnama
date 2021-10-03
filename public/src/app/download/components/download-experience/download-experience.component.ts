import { Component, OnInit } from '@angular/core'
import { ExperienceSnapshotData } from '@common/experience'
import { ExperienceService } from '@services/experience.service'

@Component({
  selector: 'app-download-experience',
  templateUrl: './download-experience.component.html',
  styleUrls: ['./download-experience.component.scss'],
})
export class DownloadExperienceComponent implements OnInit {

  private androidPkg = "com.safarnama.safarnama"
  private iosBundleID = "com.safarnamasoftware"
  private iosAppId = "1564730245"

  public snapshot: ExperienceSnapshotData | undefined
  public iOSURL: string = `https://apps.apple.com/us/app/safarnama/id${this.iosAppId}`
  public androidURL = `https://play.google.com/store/apps/details?id=${this.androidPkg}&hl=en_US&gl=US`
  public experienceURL: string | undefined

  constructor(private experienceService: ExperienceService) { }

  ngOnInit(): void {
    const split = window.location.href.split('/')
    this.experienceService.getLatestPublishedSnapshot(split[split.length - 1]).subscribe((snapshot) => {
      this.snapshot = snapshot
      if (snapshot.projectData.iOS.appStoreId) {
        this.iosAppId = `id${snapshot.projectData.iOS.appStoreId}`
      }
      if (snapshot.projectData.android.package) {
        this.androidPkg = snapshot.projectData.android.package
      }
      if (snapshot.projectData.iOS.bundleId) {
        this.iosBundleID = snapshot.projectData.iOS.bundleId
      }
      this.iOSURL = `https://apps.apple.com/us/app/${this.iosAppId}`
      this.androidURL = `https://play.google.com/store/apps/details?id=${this.androidPkg}&hl=en_US&gl=US`
      this.experienceURL = `https://safarnama.page.link/?link=${window.location.href}&apn=${this.androidPkg}&ibi=${this.iosBundleID}&isi=${this.iosAppId}`
    })
  }

  get downloadUrl(): string {
    return window.location.href
  }
}
