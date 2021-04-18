import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Route } from '@models/route';
import { MapService } from '@services/map.service';
import { RouteService } from '@services/route.service';

@Component({
  selector: 'app-route-view-all',
  templateUrl: './route-view-all.component.html',
  styleUrls: ['./route-view-all.component.scss'],
})
export class RouteViewAllComponent implements OnInit {

  public routes: Route[] = []
  public data = new MatTableDataSource<Route>(this.routes)
  public displayedColumns: string[] = ['name', 'length', 'actions']
  @ViewChild(MatSort, {static: true}) sort: MatSort

  constructor(
    public dialogRef: MatDialogRef<RouteViewAllComponent>,
    public mapService: MapService,
    private snackBar: MatSnackBar,
    public routeService: RouteService) {
  }

  ngOnInit(): void {

    this.routeService.getAll().subscribe(routes => {
      console.log('Got routes', routes)
      this.routes = routes
      this.data = new MatTableDataSource<Route>(routes)
      this.data.sortingDataAccessor = (item, property) => {
        console.log('Data assess', item, property)
        switch (property) {
          case 'name': return item.name
          default: return item[property]
        }
      }
      this.data.sort = this.sort
    })
  }

  close(): void {
    this.dialogRef.close()
  }

  goToPoi(poi: Route): void {
    // this.mapService.setLatLngZoom(poi.lat, poi.lng, 14)
  }

  deleteRoute(routeId: string): void {
    if (confirm('Are you sure you want to delete this route?')) {
      this.routeService.delete(routeId).subscribe(() => {
        this.snackBar.open('Route deleted', undefined, { duration: 5000 })
      })
    }
  }
}
