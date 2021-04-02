import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { QRCodeModule } from 'angularx-qrcode'
import {
  PublishExperienceComponent,
} from './components/publish-experience/publish-experience.component'
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [PublishExperienceComponent],
  imports: [
    CommonModule,
    QRCodeModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    PublishExperienceComponent,
  ],
})
export class PublishModule { }
