import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { PoiViewAllComponent } from '@components/poi/poi-view-all/poi-view-all.component'
import { MediaLibraryComponent } from '@components/media/media-library/media-library.component'
import {
  OpenExperienceDialogComponent,
} from '@components/experience/open-experience-dialog/open-experience-dialog.component'
import {
  CreateExperienceDialogComponent,
} from '@components/experience/create-experience-dialog/create-experience-dialog.component'
import { ExperienceService } from '@services/experience.service'
import {
  PublishExperienceComponent,
} from 'app/publish/components/publish-experience/publish-experience.component'
import { Observable, combineLatest } from 'rxjs'
import { UserService } from '@services/user.service'
import { map } from 'rxjs/operators'
import {
  AdminViewUsersComponent,
} from 'app/admin/components/admin-view-users/admin-view-users.component'
import {
  AdminViewPublishedExperiencesComponent,
} from 'app/admin/components/admin-view-published-experiences/admin-view-published-experiences.component'
import { CollaboratorsComponent } from '@components/collaborators/collaborators.component'
import { RouteViewAllComponent } from '@components/route/route-view-all/route-view-all.component';
import { ProjectViewAllComponent } from '@components/project/project-view-all/project-view-all.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {

  public isUserAdmin: Observable<boolean>
  public isExperienceMine: Observable<boolean>

  constructor(
    private dialog: MatDialog,
    private experienceService: ExperienceService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.isUserAdmin = this.userService.getMyProfile().pipe(
      map(user => user !== undefined && user.roles !== undefined && user.roles.includes('admin')),
    )
    this.isExperienceMine = combineLatest(
      this.userService.getUserId(),
      this.experienceService.getSelectedExperience(),
    ).pipe(
      map(([userId, experience]) => {
        return experience !== undefined && experience.ownerId === userId
      }),
    )
  }

  viewAllPointsOfInterest(): void {
    this.dialog.open(PoiViewAllComponent, {
      width: '800px',
      disableClose: false,
    })
  }

  viewAllRoutes(): void {
    this.dialog.open(RouteViewAllComponent, {
      width: '800px',
      disableClose: false,
    })
  }

  viewAllProjects(): void {
    this.dialog.open(ProjectViewAllComponent, {
      width: '800px',
      disableClose: false
    })
  }

  viewMediaLibrary(): void {
    this.dialog.open(MediaLibraryComponent, {
      width: '800px',
      disableClose: false,
    })
  }

  openExperience(): void {
    this.dialog.open(OpenExperienceDialogComponent, {
      width: '250px',
      disableClose: false,
    })
  }

  createNewExperience(): void {
    this.dialog.open(CreateExperienceDialogComponent, {
      width: '400px',
      disableClose: false,
    })
  }

  publish(): void {
    this.dialog.open(PublishExperienceComponent, {
      width: '400px',
      disableClose: false,
    })
  }

  get isExperienceOpen(): boolean {
    return this.experienceService.getSelectedExperienceId() !== undefined
  }

  openAdminUserDialog(): void {
    this.dialog.open(AdminViewUsersComponent, {
      width: '800px',
    })
  }

  openAdminExperiencesDialog(): void {
    this.dialog.open(AdminViewPublishedExperiencesComponent, {
      width: '800px',
    })
  }

  openCollaborators(): void {
    this.dialog.open(CollaboratorsComponent, {
      width: '400px',
    })
  }

}
