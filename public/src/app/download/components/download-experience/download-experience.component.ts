import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-download-experience',
  templateUrl: './download-experience.component.html',
  styleUrls: ['./download-experience.component.scss'],
})
export class DownloadExperienceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  get downloadUrl(): string {
    return window.location.href
  }
}
