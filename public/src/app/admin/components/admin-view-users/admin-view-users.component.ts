import { Component, OnInit, OnDestroy } from '@angular/core'
import { MatTableDataSource } from '@angular/material'
import { UserData } from '@common/user'
import { AdminService } from 'app/admin/shared/services/admin.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-admin-view-users',
  templateUrl: './admin-view-users.component.html',
  styleUrls: ['./admin-view-users.component.scss'],
})
export class AdminViewUsersComponent implements OnInit, OnDestroy {

  public users: UserData[] = []
  public data = new MatTableDataSource<UserData>(this.users)
  public displayedColumns: string[] = ['avatar', 'name', 'createdAt', 'id', 'actions']
  public subscription: Subscription | undefined

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.adminService.getUsers().subscribe(users => {
      this.users = users
      this.data = new MatTableDataSource<UserData>(users)
    })
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe()
    }
  }
}
