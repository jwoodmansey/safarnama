import { Component, OnInit, OnDestroy } from '@angular/core'
import { AdminService } from 'app/admin/shared/services/admin.service'
import { Subscription } from 'rxjs'
import { MatTableDataSource } from '@angular/material'

@Component({
  selector: 'app-admin-view-published-experiences',
  templateUrl: './admin-view-published-experiences.component.html',
  styleUrls: ['./admin-view-published-experiences.component.scss'],
})
export class AdminViewPublishedExperiencesComponent implements OnInit, OnDestroy {

  public experiences: any[]
  public data = new MatTableDataSource<any>(this.experiences)
  public displayedColumns: string[] = ['name', 'description', 'createdAt', 'version', 'shortLink',
    'owner']
  private subscription: Subscription | undefined

  constructor(
    private adminService: AdminService,
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

}
