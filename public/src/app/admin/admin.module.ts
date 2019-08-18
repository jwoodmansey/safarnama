import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule,
} from '@angular/material'
import { AdminViewUsersComponent } from './components/admin-view-users/admin-view-users.component'

@NgModule({
  declarations: [
    AdminViewUsersComponent,
  ],
  entryComponents: [
    AdminViewUsersComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    AdminViewUsersComponent,
  ],
})
export class AdminModule { }
