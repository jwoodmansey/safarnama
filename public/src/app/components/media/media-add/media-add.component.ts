import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { MediaService } from '@services/media.service'
import { ExperienceService } from '@services/experience.service'

@Component({
  selector: 'app-media-add',
  templateUrl: './media-add.component.html',
  styleUrls: ['./media-add.component.scss'],
})
export class MediaAddComponent implements OnInit, OnDestroy {

  public uploading: string[] = []

  constructor(
    public dialogRef: MatDialogRef<MediaAddComponent>,
    private mediaService: MediaService,
    private experienceService: ExperienceService,
  ) { }

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

  @ViewChild('myPond', {static: true}) myPond: any

  pondFiles = []

  pondOptions = {
    class: 'my-filepond',
    multiple: true,
    dropOnPage: true,
    dropOnElement: false,
    labelIdle: 'Drop files here, or click to upload',
    // tslint:disable-next-line:max-line-length
    acceptedFileTypes: 'image/jpeg, image/png, application/pdf, text/plain, audio/mpeg, audio/mp3, video/mp4',
    server: {
      url: './api/media',
      process: {
        url: '/process?expId=' + this.experienceService.getSelectedExperienceId(),
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
    if (!event.error) {
      this.uploading.push(event.file.id)
      this.dialogRef.disableClose = true
    }
  }

  pondHandleProgress(event: any): void {
    console.log('A file progress changed', event)
    if (event.progress === 1) {
      this.removeFromUploadingArr(event.file.id)
    }
  }

  pondHandleAbort(event: any): void {
    console.log('A file upload was aborted', event)
    this.removeFromUploadingArr(event.file.id)
  }

  pondHandleError(event: any): void {
    console.log('A file upload has error', event)
    this.removeFromUploadingArr(event.file.id)

  }

  private removeFromUploadingArr(fileId: string): void {
    this.uploading = this.uploading.filter(id => id !== fileId)
    if (this.uploading.length === 0) {
      this.dialogRef.disableClose = false
    }
  }

  get uploadsInProgress(): boolean {
    return this.uploading.length > 0
  }

  public close(): void {
    this.dialogRef.close()
  }
}
