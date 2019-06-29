import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { MediaService } from '@services/media.service'

@Component({
  selector: 'app-media-add',
  templateUrl: './media-add.component.html',
  styleUrls: ['./media-add.component.scss'],
})
export class MediaAddComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<MediaAddComponent>,
    private mediaService: MediaService) { }

  ngOnInit(): void {

    // Todo it may be possible to use FilePond as an actual media library,
    // this.mediaService.getAll().subscribe(media =>
    //   this.pondFiles = media.map(m => ({
    //     source : m.url,
    //     options: { type: 'local' },
    //   })),
    // )
  }

  ngOnDestroy(): void {
    this.mediaService.triggerRefresh()
  }

  @ViewChild('myPond') myPond: any

  pondFiles = []

  pondOptions = {
    class: 'my-filepond',
    multiple: true,
    labelIdle: 'Drop files here, or click to upload',
    acceptedFileTypes: 'image/jpeg, image/png, application/pdf, text/plain, audio/mpeg, video/mp4',
    server: {
      url: './api/media',
      process: {
        url: '/process',
        withCredentials: true,
      },
      revert: async (uniqueFileId: string, load: any, error: any) => {
        // Should remove the earlier created temp file here
        // Can call the error method if something is wrong, should exit after
        try {
          await this.mediaService.delete(uniqueFileId)
          load()
        } catch (e) {
          error(e)
        }
      },
    },
  }

  pondHandleInit(): void {
    console.log('FilePond has initialised', this.myPond)
  }

  pondHandleAddFile(event: any): void {
    console.log('A file was added', event)
  }
}
