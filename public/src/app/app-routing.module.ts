import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { IndexComponent } from '@pages/index/index.component'
import { PoiCreateComponent } from '@components/poi/poi-create/poi-create.component'
import { MainMenuComponent } from '@components/main-menu/main-menu.component'
import { ExperienceEditComponent } from
  '@pages/experience/experience-edit/experience-edit.component'
import { RouteCreateComponent } from '@pages/routes/route-create/route-create.component'
import { UserEditComponent } from './user/user-edit/user-edit.component'
import { PrivacyComponent } from '@pages/privacy/privacy.component'
import { PrivacyAppComponent } from '@pages/privacy-app/privacy-app.component'

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        component: MainMenuComponent,
      },
      {
        path: 'experience/edit',
        component: ExperienceEditComponent,
      },
      {
        path: 'user/edit',
        component: UserEditComponent,
      },
      {
        path: 'poi/edit/:id',
        component: PoiCreateComponent,
      },
      {
        path: 'poi/create',
        component: PoiCreateComponent,
      },
      {
        path: 'route/create',
        component: RouteCreateComponent,
      },
      {
        path: 'route/edit/:id',
        component: RouteCreateComponent,
      },
    ],
  },
  {
    path: 'download', loadChildren: () => import('./download/download.module').then(m => m.DownloadModule),
  },
  {
    path: 'privacy/app',
    component: PrivacyAppComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
