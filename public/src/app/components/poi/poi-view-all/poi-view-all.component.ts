import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PoiService } from '@services/poi.service'
import { MapService } from '@services/map.service'
import { PointOfInterest } from '@models/place'

@Component({
  selector: 'app-poi-view-all',
  templateUrl: './poi-view-all.component.html',
  styleUrls: ['./poi-view-all.component.scss'],
})
export class PoiViewAllComponent implements OnInit {

  public pois: PointOfInterest[] = []
  public data = new MatTableDataSource<PointOfInterest>(this.pois)
  public displayedColumns: string[] = ['type', 'name', 'mediaItems', 'actions']
  @ViewChild(MatSort, {static: true}) sort: MatSort

  constructor(
    public dialogRef: MatDialogRef<PoiViewAllComponent>,
    public mapService: MapService,
    private snackBar: MatSnackBar,
    public poiService: PoiService) {
  }

  ngOnInit(): void {

    this.poiService.getAll().subscribe(pois => {
      console.log('Got pois', pois)
      this.pois = pois
      this.data = new MatTableDataSource<PointOfInterest>(pois)
      this.data.sortingDataAccessor = (item, property) => {
        console.log('Data assess', item, property)
        switch (property) {
          case 'type': return item.placeType.name
          case 'name': return item.name
          case 'mediaItems': return item.media.length
          default: return item[property]
        }
      }
      this.data.sort = this.sort
    })
    // this.data.sort = this.sort
  }

  close(): void {
    this.dialogRef.close()
  }

  goToPoi(poi: PointOfInterest): void {
    this.mapService.setLatLngZoom(poi.lat, poi.lng, 14)
  }

  deletePoi(poiId: string): void {
    if (confirm('Are you sure you want to delete this Place?')) {
      this.poiService.deletePoi(poiId).subscribe(() => {
        this.snackBar.open('Place deleted', undefined, { duration: 5000 })
      })
    }
  }
}
