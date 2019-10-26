import { Component, OnInit, OnDestroy } from '@angular/core'
import { AdminService } from 'app/admin/shared/services/admin.service'
import { Subscription } from 'rxjs'
import { MatTableDataSource, MatSnackBar } from '@angular/material'

@Component({
  selector: 'app-admin-view-published-experiences',
  templateUrl: './admin-view-published-experiences.component.html',
  styleUrls: ['./admin-view-published-experiences.component.scss'],
})
export class AdminViewPublishedExperiencesComponent implements OnInit, OnDestroy {

  public experiences: any[]
  public data = new MatTableDataSource<any>(this.experiences)
  // 'description',
  public displayedColumns: string[] = ['name', 'createdAt', 'version', 'shortLink',
    'owner', 'actions']
  private subscription: Subscription | undefined

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.subscription = this.adminService.getPublishedExperiences().subscribe(experiences => {
      this.experiences = experiences
      this.data = new MatTableDataSource<any>(experiences)
    })
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe()
    }
  }

  featureExperience(exp: any, feature: boolean): void {
    this.adminService.setAsExperienceAsFeatured(exp._id, feature).subscribe(res => {
      console.log('Experience set as featured', exp)
      exp.metaData.featured = feature
      this.snackBar.open(
        feature ?
        `${exp.name} is now a featured experience` :
        `${exp.name} is no longer a featured experience`,
        undefined, { duration: 5000 },
      )
    })
  }
}
