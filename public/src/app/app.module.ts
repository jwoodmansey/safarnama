import { AgmCoreModule } from '@agm/core'
// import { AgmMarkerWithLabelModule } from '@ajqua/marker-with-label'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { LayoutModule } from '@angular/cdk/layout'
import { registerLocaleData } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import enGB from '@angular/common/locales/en-GB'
import { LOCALE_ID, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { PromptExperienceDialogComponent } from '@components/experience/prompt-experience-dialog/prompt-experience-dialog.component'
import { PoiTypeLibraryComponent } from '@components/poi/poi-type-library/poi-type-library.component'
import { AgmPolylineEditableDirective } from '@components/route-editor/AgmPolylineEditable'
import { IndexComponent } from '@pages/index/index.component'
import { RouteCreateComponent } from '@pages/routes/route-create/route-create.component'
import { ExperienceService } from '@services/experience.service'
import { environment } from 'environments/environment'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import * as FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { MccColorPickerModule } from 'material-community-components/color-picker'
import { FilePondModule, registerPlugin } from 'ngx-filepond'
import { QuillModule } from 'ngx-quill'
import { AdminModule } from './admin/admin.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CollaboratorsComponent } from './components/collaborators/collaborators.component'
import { CreateExperienceDialogComponent } from './components/experience/create-experience-dialog/create-experience-dialog.component'
import { OpenExperienceDialogComponent } from './components/experience/open-experience-dialog/open-experience-dialog.component'
import { MainMenuComponent } from './components/main-menu/main-menu.component'
import { MapContentComponent } from './components/map-content/map-content.component'
import { MediaAddComponent } from './components/media/media-add/media-add.component'
import { MediaAttacherComponent } from './components/media/media-attacher/media-attacher.component'
import {
  MediaEditTextComponent
} from './components/media/media-edit-text/media-edit-text.component'
import { MediaEditComponent } from './components/media/media-edit/media-edit.component'
import { MediaItemComponent } from './components/media/media-item/media-item.component'
import { MediaLibraryComponent } from './components/media/media-library/media-library.component'
import { PoiCreateComponent } from './components/poi/poi-create/poi-create.component'
import { PoiViewAllComponent } from './components/poi/poi-view-all/poi-view-all.component'
import { RouteEditorComponent } from './components/route-editor/route-editor.component'
import { RouteToolbarComponent } from './components/route/route-toolbar/route-toolbar.component'
import { RouteViewAllComponent } from './components/route/route-view-all/route-view-all.component'
import { LoginComponent } from './components/user/login/login.component'
import { ExperienceEditComponent } from './pages/experience/experience-edit/experience-edit.component'
import { PrivacyAppComponent } from './pages/privacy-app/privacy-app.component'
import { PrivacyComponent } from './pages/privacy/privacy.component'
import { TermsComponent } from './pages/terms/terms.component'
import { PublishModule } from './publish/publish.module'
import { HtmlFromUrlPipe } from './shared/pipes/html-from-url.pipe'
import { SafePipe } from './shared/pipes/safe.pipe'
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { ProjectViewAllComponent } from './components/project/project-view-all/project-view-all.component';
import { ProjectViewComponent } from './components/project/project-view/project-view.component'


registerLocaleData(enGB)

registerPlugin(FilePondPluginFileValidateType)
registerPlugin(FilePondPluginImagePreview)
registerPlugin(FilePondPluginFileEncode)
registerPlugin(FilePondPluginFileValidateSize);

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
    PrivacyAppComponent,
    ProjectViewAllComponent,
    ProjectViewComponent,
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
    { provide: LOCALE_ID, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
