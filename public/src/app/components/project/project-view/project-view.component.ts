import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {

  private projectId: string

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
  ) { }

  ngOnInit(): void {
    this.projectId = this.data.id
  }

}
