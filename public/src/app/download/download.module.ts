import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { DownloadRoutingModule } from './download-routing.module'
import {
  DownloadExperienceComponent,
} from './components/download-experience/download-experience.component'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper'
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    DownloadExperienceComponent,
  ],
  imports: [
    CommonModule,
    DownloadRoutingModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    QRCodeModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class DownloadModule { }
