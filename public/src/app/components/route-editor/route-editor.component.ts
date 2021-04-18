import { AgmPolyline } from '@agm/core'
import { Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core'
import { EditingRoute, RouteEditorService } from '@services/editors/route-editor.service'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

declare var google:any;

@Component({
  selector: 'app-route-editor',
  templateUrl: './route-editor.component.html',
  styleUrls: ['./route-editor.component.scss'],
})
export class RouteEditorComponent implements OnInit, OnChanges {

  @ViewChild('line', {static: false})
  public lineRef: ElementRef<AgmPolyline>
  public $route: Observable<EditingRoute>
  public showLine: boolean = true

  constructor(private routeEditorService: RouteEditorService) { }

  ngOnInit(): void {
    // console.log(this.lineRef.nativeElement.points)
          this.$route = this.routeEditorService.getRoute().pipe((tap((r) => {
        // const path = poly.getPath();
        // console.log('path',path)
        // // Because path is an MVCArray, we can simply append a new coordinate
        // // and it will automatically appear.
        // path.push(r.getPoints());
      })))
    // this.polyLineManager.createEventObservable('dragend', this.lineRef.nativeElement).subscribe(() => {
    //   console.log('ON NEXT')
    // })
    // this.polyLineManager.createEventObservable('dragend', this.lineRef.nativeElement).subscribe(() => {
    //   console.log('ON NEXT')
    // })

    // this.map.getNativeMap().then((m) => {
    //   // google.maps.event.addListener(this.lineRef.nativeElement.getPath( ), 'edit_start', function(){
    //   //   log("[edit_start]");
    //   // });
    //   const poly = new google.maps.Polyline({
    //     path: [],
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2,
    //     editable: true,
    //     draggable: true
    //   });
    //   console.log('POLY SET MAP')
    //   poly.setMap(m)
    //   this.$route = this.routeEditorService.getRoute().pipe((tap((r) => {
    //     const path = poly.getPath();
    //     console.log('path',path)
    //     // Because path is an MVCArray, we can simply append a new coordinate
    //     // and it will automatically appear.
    //     path.push(r.getPoints());
    //   })))

    //   // m.addListener()

    //   // var polyline = new google.maps.Polyline({
    //   //   map: m,
    //   //   path: [
    //   //     new google.maps.LatLng(40.77153,-73.97722),
    //   //     new google.maps.LatLng(40.77803,-73.96657)
    //   //   ]
    //   // });
      
    //   // polyline.edit(); // start edit
    // })
  }

  ngOnChanges(): void {
    console.log('route editor on changes ran')
  }

  public lineDragEnd($event): void {
    console.log('Line drag end',$event)
  }

  public pointsChanged($event): void {
    // google.maps.event.addListener(this.lineRef.nativeElement.getPath(), 'insert_at', () => console.log('TEST'))

    console.log('event', $event)
    // this.lineRef.nativeElement.
    // needed to keep polyPathChange firing
    this.showLine = false;
    setTimeout(() => this.showLine = true);
    
    // console.log(await this.lineRef.nativeElement.getPath())
  }

  public dragEnd($event: any) {
    // console.log('Drag end', $event)
    // this.routeEditorService.addPoint
  }
}
