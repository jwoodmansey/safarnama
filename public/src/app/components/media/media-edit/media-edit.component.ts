import { Component, Inject, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Media } from '@models/media'
import { MediaService } from '@services/media.service'

const URL_REG = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

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


  linkToFormGroup(link: {name: string, url:string}): FormGroup {
    return this.fb.group({name: [link.name, Validators.required], url: [link.url, Validators.pattern(URL_REG)]})
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.mediaItem.name ? this.mediaItem.name : ''],
      description: [this.mediaItem.description ? this.mediaItem.description : ''],
      acknowledgements: [this.mediaItem.acknowledgements ? this.mediaItem.acknowledgements : ''],
      externalLinks: this.mediaItem.externalLinks ? this.fb.array(this.mediaItem.externalLinks.map(l => this.linkToFormGroup(l))) : this.fb.array([]),
    });
  }

  addExternalLink(): void {
    (this.form.get('externalLinks') as FormArray).push(this.linkToFormGroup({name: '', url: ''}))
  }

  removeExternalLink(i: number): void {
    (this.form.get('externalLinks') as FormArray).removeAt(i)
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
        externalLinks: this.form.get('externalLinks').value,
      })
      this.mediaItem.name = media.name
      this.mediaItem.description = media.description
      this.mediaItem.acknowledgements = media.acknowledgements
      this.mediaItem.externalLinks = media.externalLinks
      this.close()
    }
  }
}
