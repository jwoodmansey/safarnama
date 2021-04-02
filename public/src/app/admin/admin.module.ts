import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
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
