import { Component, OnInit, Input } from '@angular/core'
import { Media } from '@models/media'

@Component({
  selector: 'app-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.scss'],
})
export class MediaItemComponent implements OnInit {

  @Input()
  public thumb: boolean = false

  @Input()
  public mediaItem: Media

  constructor() { }

  ngOnInit(): void {
  }

}
