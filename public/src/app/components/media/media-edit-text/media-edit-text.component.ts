import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Media } from '@models/media'
import { MediaService } from '@services/media.service'

@Component({
  selector: 'app-media-edit-text',
  templateUrl: './media-edit-text.component.html',
  styleUrls: ['./media-edit-text.component.scss'],
})
export class MediaEditTextComponent implements OnInit {

  public textVar: any = ''

  constructor(public dialogRef: MatDialogRef<MediaEditTextComponent>,
              @Inject(MAT_DIALOG_DATA) public mediaItem: Media,
              private mediaService: MediaService) { }

  ngOnInit(): void {
  }

  async done(): Promise<void> {
    const file = new File([this.textVar], 'text.html', {
      type: 'text/html',
    })
    try {
      await this.mediaService.create(file)
      this.mediaService.triggerRefresh()
      this.dialogRef.close()
    } catch (e) {
      alert('Text could not be created ' + JSON.stringify(e))
    }
  }

  close(): void {
    this.dialogRef.close()
  }
}
