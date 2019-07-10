import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Media } from '@models/media'
import { MediaService } from '@services/media.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-media-edit-text',
  templateUrl: './media-edit-text.component.html',
  styleUrls: ['./media-edit-text.component.scss'],
})
export class MediaEditTextComponent implements OnInit {

  public textVar: any = ''

  constructor(public dialogRef: MatDialogRef<MediaEditTextComponent>,
              @Inject(MAT_DIALOG_DATA) public mediaItem: Media,
              private http: HttpClient,
              private mediaService: MediaService) { }

  ngOnInit(): void {
    if (this.mediaItem) {
      if (this.mediaItem.type !== 'Text') {
        alert('Error, cannot edit this media type as text')
      } else {
        this.http.get(
          this.mediaItem.url,
          {
            responseType: 'text',
            headers: new HttpHeaders({ accept: 'text/html' }),
          }).pipe(take(1)).subscribe(resp => {
            console.log('resp', resp)
            this.textVar = resp
          })
      }
    }
    this.mediaItem.url
  }

  async done(): Promise<void> {
    try {
      await this.mediaService.create(this.getFile())
      this.mediaService.triggerRefresh()
      this.dialogRef.close()
    } catch (e) {
      console.error(e)
      alert('Text could not be created ' + JSON.stringify(e))
    }
  }

  close(): void {
    this.dialogRef.close()
  }

  async edit(): Promise<void> {
    try {
      await this.mediaService.editText(this.mediaItem.id, this.getFile())
      this.mediaService.triggerRefresh()
      this.dialogRef.close()
    } catch (e) {
      console.error(e)
      alert('Text could not be edited ' + JSON.stringify(e))
    }
  }

  private getFile(): File {
    return new File([this.textVar], 'text.html', {
      type: 'text/html',
    })
  }
}
