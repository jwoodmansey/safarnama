import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { IndexComponent } from '@pages/index/index.component'
import { PoiCreateComponent } from '@components/poi/poi-create/poi-create.component'
import { MainMenuComponent } from '@components/main-menu/main-menu.component'
import { ExperienceEditComponent } from
  '@pages/experience/experience-edit/experience-edit.component'
import { RouteCreateComponent } from '@pages/routes/route-create/route-create.component'

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
    path: 'download', loadChildren: './download/download.module#DownloadModule',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
