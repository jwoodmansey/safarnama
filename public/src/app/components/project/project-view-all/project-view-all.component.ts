import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectData } from '@common/project';
import { ProjectService } from '@services/project.service';
import { Subscription } from 'rxjs';
import { ProjectViewComponent } from '../project-view/project-view.component';

@Component({
  selector: 'app-project-view-all',
  templateUrl: './project-view-all.component.html',
  styleUrls: ['./project-view-all.component.scss']
})
export class ProjectViewAllComponent implements OnInit, OnDestroy {

  private subscription: Subscription
  public projects: ProjectData[] = []
  public data = new MatTableDataSource<ProjectData>(this.projects)
  public displayedColumns: string[] = ['name', 'actions']

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscription = this.projectService.getListAdmin().subscribe((projects) => {
      this.projects = projects
      this.data = new MatTableDataSource<ProjectData>(projects)
    })
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe()
    }
  }

  manageProject(id: string): void {
    this.dialog.open(ProjectViewComponent, {
      width: '750px',
      disableClose: false,
      data: {
        project: this.projects.find(p => p._id === id),
      }
    })
  }

}
