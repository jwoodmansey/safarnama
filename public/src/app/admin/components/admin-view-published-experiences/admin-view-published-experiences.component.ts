import { Component, OnInit, OnDestroy } from '@angular/core'
import { AdminService } from 'app/admin/shared/services/admin.service'
import { Subscription } from 'rxjs'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FeatureExperienceComponent } from '../feature-experience/feature-experience.component'

@Component({
  selector: 'app-admin-view-published-experiences',
  templateUrl: './admin-view-published-experiences.component.html',
  styleUrls: ['./admin-view-published-experiences.component.scss'],
})
export class AdminViewPublishedExperiencesComponent implements OnInit, OnDestroy {

  public experiences: any[]
  public data = new MatTableDataSource<any>()
  // 'description',
  public displayedColumns: string[] = ['name', 'createdAt', 'version', 'shortLink',
    'owner', 'actions']
  private subscription: Subscription | undefined

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
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
    if (feature) {
      this.dialog.open(FeatureExperienceComponent, {
        width: '800px;',
        disableClose: false,
        data: exp,
      })
    } else {
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
}
