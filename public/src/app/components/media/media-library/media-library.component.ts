import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Media } from '@models/media'
import { MediaService } from '@services/media.service'
import { MediaAddComponent } from '../media-add/media-add.component'
import { MediaEditComponent } from '../media-edit/media-edit.component'
import { MediaEditTextComponent } from '../media-edit-text/media-edit-text.component'

@Component({
  selector: 'app-media-library',
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.scss'],
})
export class MediaLibraryComponent implements OnInit {

  public media: Media[] = []
  public filteredMedia: Media[] = []

  public loaded: boolean = false
  public filterForm: FormGroup
  public selectingMedia: Media[] | undefined

  constructor(
    private dialog: MatDialog,
    private mediaService: MediaService,
    public dialogRef: MatDialogRef<MediaLibraryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.data !== undefined && this.data !== null && this.data.selectingMedia !== undefined) {
      this.selectingMedia = this.data.selectingMedia
    }
    this.filterForm = this.fb.group(
      {
        type: ['All', Validators.required],
        sortBy: ['Added', Validators.required],
      },
    )
    this.filterForm.get('type').valueChanges.subscribe(o => this.filterMedia())
    this.filterForm.get('sortBy').valueChanges.subscribe(o => this.sortMedia())
    this.mediaService.getAll().subscribe(media => {
      this.media = media
      this.filterMedia()
      this.loaded = true
    })
  }

  get selecting(): boolean {
    return this.selectingMedia !== undefined
  }

  isSelected(item: Media): boolean {
    if (this.selectingMedia !== undefined) {
      return this.selectingMedia.find(media =>
        media.id === item.id) !== undefined
    }
    return false
  }

  select(item: Media): void {
    const idx: number = this.selectingMedia.findIndex(media =>
      media.id === item.id)
    console.log('IDX', idx)
    if (idx >= 0) {
      this.selectingMedia.splice(idx, 1)
    } else {
      this.selectingMedia.push(item)
    }
  }

  filterMedia(): void {
    const type = this.filterForm.get('type').value
    if (type === 'All') {
      this.filteredMedia = this.media
    } else {
      this.filteredMedia = this.media.filter(media => type === media.type)
    }
    this.sortMedia()
  }

  private getTime(date?: Date): number {
    return date != null ? date.getTime() : 0
  }

  private compareDates(a: Date, b: Date): number {
    return this.getTime(a) - this.getTime(b)
  }

  sortMedia(): void {
    const sortBy = this.filterForm.get('sortBy').value
    this.filteredMedia = this.filteredMedia.sort((a, b) => {
      console.log('Sorting', sortBy, this.filteredMedia)
      switch (sortBy) {
        case 'Added':
          return this.compareDates(a.createdAt, b.createdAt)
        case 'Edited':
          return this.compareDates(a.updatedAt, b.updatedAt)
        case 'Name':
          return a.name.localeCompare(b.name)
      }
      return 0
    })
  }

  close(): void {
    this.dialogRef.close({ selectingMedia: this.selectingMedia })
  }

  add(): void {
    this.dialog.open(MediaAddComponent, {
      width: '600px;',
      disableClose: false,
    })
  }

  editMedia(id: string): void {
    const media = this.media.find(media => media.id === id)
    if (media.type === 'Text') {
      this.dialog.open(MediaEditTextComponent, {
        width: '600px;',
        disableClose: false,
        data: media,
      })
    } else {
      this.dialog.open(MediaEditComponent, {
        width: '600px;',
        disableClose: false,
        data: media,
      })
    }
  }

  createTextMedia(): void {
    // const media = this.media.find(media => media.id === id)
    this.dialog.open(MediaEditTextComponent, {
      width: '600px;',
      height: '400px;',
      disableClose: false,
    })
  }

  async deleteMedia(id: string): Promise<void> {
    // tslint:disable-next-line:max-line-length
    if (confirm('Are you sure you want to delete this media item?\nit will also be unavailable in any published experiences. ')) {
      try {
        await this.mediaService.delete(id)
        const idx = this.media.findIndex(media => media.id === id)
        this.media.splice(idx, 1)
        this.filterMedia()
      } catch (e) {
        alert('Media could not be deleted' + JSON.stringify(e))
      }
    }
  }
}
