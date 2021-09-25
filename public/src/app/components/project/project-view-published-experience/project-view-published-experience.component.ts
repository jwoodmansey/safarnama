import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ExperienceSnapshotData, MetaData } from '@common/experience';
import { ProjectData } from '@common/project';
import { AdminService } from 'app/admin/shared/services/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-view-published-experience',
  templateUrl: './project-view-published-experience.component.html',
  styleUrls: ['./project-view-published-experience.component.scss']
})
export class ProjectViewPublishedExperienceComponent implements OnInit, OnDestroy, OnChanges {


  @Input()
  public project: ProjectData
  public experiences: ExperienceSnapshotData[]
  public data = new MatTableDataSource<any>()
  // 'description',
  public displayedColumns: string[] = ['name', 'createdAt', 'version', 'shortLink',
    'owner', 'actions']
  private subscription: Subscription | undefined

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    if (this.project && !this.experiences) {
      this.subscription = this.adminService.getPublishedExperiences(this.project._id).subscribe((experiences) => {
        this.experiences = experiences
        this.data = new MatTableDataSource<any>(experiences)
      })
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  featureExperience(experience: { _id: string, name: string, metaData: MetaData }, feature: boolean) {
    this.adminService
      .setAsExperienceAsFeatured(experience._id, true, [this.project.name])
      .subscribe((res) => {
        experience.metaData.featured = feature
        this.snackBar.open(
          `${experience.name} is now a featured experience`,
          undefined,
          { duration: 5000 }
        );
      });
  }
}
