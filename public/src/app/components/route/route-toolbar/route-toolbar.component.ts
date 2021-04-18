import { Component, OnInit } from '@angular/core';
import { EditingRoute, RouteEditorService } from '@services/editors/route-editor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-route-toolbar',
  templateUrl: './route-toolbar.component.html',
  styleUrls: ['./route-toolbar.component.scss']
})
export class RouteToolbarComponent implements OnInit {

  public editingRoute: Observable<EditingRoute>
  public isEditingRoute: Observable<boolean>

  constructor(
    private routeEditorService: RouteEditorService
  ) { }

  ngOnInit(): void {
    this.editingRoute = this.routeEditorService.getRoute()
    this.isEditingRoute = this.routeEditorService.isEditingRoute()
  }

  undo() {
    this.routeEditorService.undo()
  }
}
