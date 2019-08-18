import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule,
} from '@angular/material'
import { AdminViewUsersComponent } from './components/admin-view-users/admin-view-users.component'
import {
  AdminViewPublishedExperiencesComponent,
} from './components/admin-view-published-experiences/admin-view-published-experiences.component'

@NgModule({
  declarations: [
    AdminViewUsersComponent,
    AdminViewPublishedExperiencesComponent,
  ],
  entryComponents: [
    AdminViewUsersComponent,
    AdminViewPublishedExperiencesComponent,
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
    AdminViewPublishedExperiencesComponent,
  ],
})
export class AdminModule { }
