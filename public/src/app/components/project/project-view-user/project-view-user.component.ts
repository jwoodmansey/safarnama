import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Member, ProjectData } from '@common/project';
import { ProjectService } from '@services/project.service';

@Component({
  selector: 'app-project-view-user',
  templateUrl: './project-view-user.component.html',
  styleUrls: ['./project-view-user.component.scss']
})
export class ProjectViewUserComponent implements OnInit, OnChanges {

  @Input()
  public projectData: ProjectData
  public data = new MatTableDataSource<Member>()
  public displayedColumns: string[] = ['userId', 'name', 'roles', 'actions']

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.data = new MatTableDataSource<Member>(this.projectData?.members)
  }


  public toggleAdmin(member: Member) {
    if (member.roles.includes('admin')) {
      this.projectService.removeRole(this.projectData._id, member.userId, 'admin').subscribe((project) => {
        this.projectData = project
      })
    } else {
      this.projectService.setRole(this.projectData._id, member.userId, 'admin').subscribe((project) => {
        this.projectData = project
      })
    }
  }

}
