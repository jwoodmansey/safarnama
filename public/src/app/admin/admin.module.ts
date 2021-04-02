import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatChipsModule, MatDialogModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';
import {
  AdminViewPublishedExperiencesComponent
} from './components/admin-view-published-experiences/admin-view-published-experiences.component';
import { AdminViewUsersComponent } from './components/admin-view-users/admin-view-users.component';
import { FeatureExperienceComponent } from './components/feature-experience/feature-experience.component';

@NgModule({
  declarations: [
    AdminViewUsersComponent,
    AdminViewPublishedExperiencesComponent,
    FeatureExperienceComponent,
  ],
  entryComponents: [
    AdminViewUsersComponent,
    AdminViewPublishedExperiencesComponent,
    FeatureExperienceComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    AdminViewUsersComponent,
    AdminViewPublishedExperiencesComponent,
  ],
})
export class AdminModule { }
