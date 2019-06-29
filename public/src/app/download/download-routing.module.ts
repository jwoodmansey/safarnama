import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import {
  DownloadExperienceComponent,
} from './components/download-experience/download-experience.component'

const routes: Routes = [{
  path: ':id',
  component: DownloadExperienceComponent,
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadRoutingModule { }
