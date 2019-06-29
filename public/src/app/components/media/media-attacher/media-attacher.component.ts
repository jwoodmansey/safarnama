import { Component, OnInit, Input } from '@angular/core'
import { Media } from '@models/media'
import { MatDialog } from '@angular/material'
import { MediaLibraryComponent } from '../media-library/media-library.component'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-media-attacher',
  templateUrl: './media-attacher.component.html',
  styleUrls: ['./media-attacher.component.scss'],
})
export class MediaAttacherComponent implements OnInit {

  @Input()
  public media: Media[] = []

  constructor(private dialog: MatDialog) { }

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
    })
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
