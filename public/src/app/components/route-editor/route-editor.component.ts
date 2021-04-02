import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core'
import { RouteEditorService, EditingRoute } from '@services/editors/route-editor.service'
import { Observable } from 'rxjs'
import { AgmPolyline } from '@agm/core'
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-route-editor',
  templateUrl: './route-editor.component.html',
  styleUrls: ['./route-editor.component.scss'],
})
export class RouteEditorComponent implements OnInit, OnChanges {

  @ViewChild('line')
  public lineRef: ElementRef<AgmPolyline>
  public $route: Observable<EditingRoute>

  constructor(private routeEditorService: RouteEditorService) { }

  ngOnInit(): void {
    this.$route = this.routeEditorService.getRoute().pipe((tap((r) => console.log('Got route', r))))
    // console.log(this.lineRef.nativeElement.points)
    console.log('ROUTEDITOR')
  }

  ngOnChanges(): void {
    console.log('route editor on changes ran')
  }

  public lineDragEnd($event): void {
    console.log('Line drag end',$event)
  }

  public pointsChanged($event): void {
    console.log('event')
  }
}
