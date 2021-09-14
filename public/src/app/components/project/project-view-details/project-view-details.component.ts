import { Component, Input, OnInit } from '@angular/core';
import { ProjectData } from '@common/project';

@Component({
  selector: 'app-project-view-details',
  templateUrl: './project-view-details.component.html',
  styleUrls: ['./project-view-details.component.scss']
})
export class ProjectViewDetailsComponent implements OnInit {

  @Input()
  public project: ProjectData

  constructor() { }

  ngOnInit(): void {
  }

}
