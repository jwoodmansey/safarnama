import { Component, OnInit, Input } from '@angular/core'
import { Media } from '@models/media'
import { MatDialog } from '@angular/material/dialog';
import { MediaLibraryComponent } from '../media-library/media-library.component'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MediaEditTextComponent } from '../media-edit-text/media-edit-text.component'
import { MediaEditComponent } from '../media-edit/media-edit.component'
import { ExperienceService } from '@services/experience.service'

@Component({
  selector: 'app-media-attacher',
  templateUrl: './media-attacher.component.html',
  styleUrls: ['./media-attacher.component.scss'],
})
export class MediaAttacherComponent implements OnInit {

  @Input()
  public media: Media[] = []

  constructor(
    private dialog: MatDialog,
    private experienceService: ExperienceService,
  ) { }

  ngOnInit(): void {
  }

  add(): void {
    this.dialog.open(MediaLibraryComponent, {
      width: '800px',
      disableClose: true,
      data: {
        selectingMedia: this.media,
      },
    }).afterClosed().subscribe(o => {
      this.media = o.selectingMedia
      if (o.selectingMedia) {
        o.selectingMedia.forEach((media: Media) => {
          media.associateWith(this.experienceService.getSelectedExperienceId())
        })
      }
    })
  }

  edit(id: string): void {
    const media = this.media.find(media => media.id === id)
    if (media.type === 'Text') {
      this.dialog.open(MediaEditTextComponent, {
        width: '800px;',
        disableClose: false,
        data: media,
      }).afterClosed().subscribe(o => {
        // Dont need need to update here, the observable onMediaChanged will take care
        // const editedMedia = o.media
        // const idx = this.media.findIndex(item => item.id === editedMedia)
        // if (idx >= 0) {
        //   this.media[idx] = o.editedMedia
        // }
      })
    } else {
      this.dialog.open(MediaEditComponent, {
        width: '600px;',
        disableClose: false,
        data: media,
      })
    }
  }

  remove(idx: number): void {
    this.media.splice(idx, 1)
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.media, event.previousIndex, event.currentIndex)
  }

  move(previousIndex: number, currentIndex: number): void {
    moveItemInArray(this.media, previousIndex, currentIndex)
  }
}
