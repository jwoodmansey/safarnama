import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectData } from '@common/project';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {

  public project: ProjectData

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: ProjectData },
  ) { }

  ngOnInit(): void {
    this.project = this.data.project
  }

}
