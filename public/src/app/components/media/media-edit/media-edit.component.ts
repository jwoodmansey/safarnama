import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Media } from '@models/media'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MediaService } from '@services/media.service'

@Component({
  selector: 'app-media-edit',
  templateUrl: './media-edit.component.html',
  styleUrls: ['./media-edit.component.scss'],
})
export class MediaEditComponent implements OnInit {

  public form: FormGroup

  constructor(public dialogRef: MatDialogRef<MediaEditComponent>,
              @Inject(MAT_DIALOG_DATA) public mediaItem: Media,
              private mediaService: MediaService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.mediaItem.name ? this.mediaItem.name : ''],
      description: [this.mediaItem.description ? this.mediaItem.description : ''],
      acknowledgements: [this.mediaItem.acknowledgements ? this.mediaItem.acknowledgements : ''],
    })
  }

  close(): void {
    this.dialogRef.close()
  }

  async submit(): Promise<void> {

    if (this.form.valid) {
      const media = await this.mediaService.edit(this.mediaItem.id, {
        name: this.form.get('name').value,
        description: this.form.get('description').value,
        acknowledgements: this.form.get('acknowledgements').value,
      })
      this.mediaItem.name = media.name
      this.mediaItem.description = media.description
      this.mediaItem.acknowledgements = media.acknowledgements
      this.close()
    }
  }
}
