import { BrowserModule } from '@angular/platform-browser'
import { NgModule, LOCALE_ID } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { IndexComponent } from '@pages/index/index.component'
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutModule } from '@angular/cdk/layout'
import { PromptExperienceDialogComponent } from
  '@components/experience/prompt-experience-dialog/prompt-experience-dialog.component'
import { AgmCoreModule } from '@agm/core'
import { OpenExperienceDialogComponent } from
  './components/experience/open-experience-dialog/open-experience-dialog.component'
import { ExperienceService } from '@services/experience.service'
import { HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './components/user/login/login.component'
import { CreateExperienceDialogComponent }
  from './components/experience/create-experience-dialog/create-experience-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PoiCreateComponent } from './components/poi/poi-create/poi-create.component'
import { MccColorPickerModule } from 'material-community-components/color-picker'
import { MainMenuComponent } from './components/main-menu/main-menu.component'
import { PoiViewAllComponent } from './components/poi/poi-view-all/poi-view-all.component'
import { ExperienceEditComponent }
  from './pages/experience/experience-edit/experience-edit.component'
import { RouteEditorComponent } from './components/route-editor/route-editor.component'
import { RouteCreateComponent } from '@pages/routes/route-create/route-create.component'
import { RouteEditorService } from '@services/editors/route-editor.service'
import { AgmPolylineEditableDirective } from '@components/route-editor/AgmPolylineEditable'
import { MediaLibraryComponent } from './components/media/media-library/media-library.component'
import { MediaAddComponent } from './components/media/media-add/media-add.component'
import { FilePondModule, registerPlugin } from 'ngx-filepond'
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import * as FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { MediaEditComponent } from './components/media/media-edit/media-edit.component'
import { MediaItemComponent } from './components/media/media-item/media-item.component'
import { PoiTypeLibraryComponent }
  from '@components/poi/poi-type-library/poi-type-library.component'
import { SafePipe } from './shared/pipes/safe.pipe'
import { MediaAttacherComponent } from './components/media/media-attacher/media-attacher.component'
// import { AgmMarkerWithLabelModule } from '@ajqua/marker-with-label'
import { DragDropModule } from '@angular/cdk/drag-drop'
import {
  MediaEditTextComponent,
} from './components/media/media-edit-text/media-edit-text.component'
import { PublishModule } from './publish/publish.module'
import { MatSortModule } from '@angular/material/sort'
import { environment } from 'environments/environment'
import { HtmlFromUrlPipe } from './shared/pipes/html-from-url.pipe'
import { MapContentComponent } from './components/map-content/map-content.component'
import { TermsComponent } from './pages/terms/terms.component'
import { UserEditComponent } from './user/user-edit/user-edit.component'
import { AdminModule } from './admin/admin.module'
import enGB from '@angular/common/locales/en-GB'
import { registerLocaleData } from '@angular/common'
import { CollaboratorsComponent } from './components/collaborators/collaborators.component'
import { PrivacyComponent } from './pages/privacy/privacy.component'
import { QuillModule } from 'ngx-quill';
import { RouteViewAllComponent } from './components/route/route-view-all/route-view-all.component';
import { RouteToolbarComponent } from './components/route/route-toolbar/route-toolbar.component'

registerLocaleData(enGB)

registerPlugin(FilePondPluginFileValidateType)
registerPlugin(FilePondPluginImagePreview)

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    PromptExperienceDialogComponent,
    OpenExperienceDialogComponent,
    LoginComponent,
    CreateExperienceDialogComponent,
    PoiCreateComponent,
    MainMenuComponent,
    PoiViewAllComponent,
    ExperienceEditComponent,
    RouteCreateComponent,
    RouteEditorComponent,
    AgmPolylineEditableDirective,
    MediaLibraryComponent,
    MediaAddComponent,
    MediaEditComponent,
    MediaItemComponent,
    PoiTypeLibraryComponent,
    SafePipe,
    MediaAttacherComponent,
    MediaEditTextComponent,
    HtmlFromUrlPipe,
    MapContentComponent,
    TermsComponent,
    UserEditComponent,
    CollaboratorsComponent,
    PrivacyComponent,
    RouteViewAllComponent,
    RouteToolbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatTableModule,
    MatTooltipModule,
    DragDropModule,
    MatSnackBarModule,
    MatSortModule,
    PublishModule,
    AdminModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': [1, 2, 3] }],
        ]
      }
    }),
    MatListModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MccColorPickerModule.forRoot({
      empty_color: 'transparent',
      used_colors: ['#000000', '#FFF555'],
    }),
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google.maps.publicKey,
    }),
    HttpClientModule,
    FilePondModule,
    // AgmMarkerWithLabelModule,
  ],
  providers: [
    ExperienceService,
    RouteEditorService,
    { provide: LOCALE_ID, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
