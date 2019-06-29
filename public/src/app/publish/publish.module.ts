import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { QRCodeModule } from 'angularx-qrcode'
import {
  PublishExperienceComponent,
} from './components/publish-experience/publish-experience.component'
import { MatButtonModule } from '@angular/material'

@NgModule({
  declarations: [PublishExperienceComponent],
  imports: [
    CommonModule,
    QRCodeModule,
    MatButtonModule,
  ],
  entryComponents: [
    PublishExperienceComponent,
  ],
  exports: [
    PublishExperienceComponent,
  ],
})
export class PublishModule { }
