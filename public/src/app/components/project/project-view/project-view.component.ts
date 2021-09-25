import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectData } from '@common/project';
import { ProjectService } from '@services/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit, OnDestroy {

  public project: ProjectData
  private subscription: Subscription

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: ProjectData },
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.project = this.data.project
    this.subscription = this.projectService.getById(this.project._id).subscribe((project) => {
      this.project = project
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
