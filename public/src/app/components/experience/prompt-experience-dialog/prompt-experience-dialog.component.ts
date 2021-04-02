import { Component } from '@angular/core'
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { OpenExperienceDialogComponent } from
'../open-experience-dialog/open-experience-dialog.component'
import { CreateExperienceDialogComponent } from
 '../create-experience-dialog/create-experience-dialog.component'

@Component({
  selector: 'app-prompt-experience-dialog',
  templateUrl: './prompt-experience-dialog.component.html',
  styleUrls: ['./prompt-experience-dialog.component.scss'],
})
export class PromptExperienceDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PromptExperienceDialogComponent>,
    public dialog: MatDialog,
  )
  // @Inject(MAT_DIALOG_DATA) public data: DialogData)
  { }

  onNoClick(): void {
    // this.dialogRef.close()
  }

  open(): void {
    const dialogRef = this.dialog.open(OpenExperienceDialogComponent, {
      width: '250px',
      disableClose: false,
      // data: { name: this.name, animal: this.animal },
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
      // this.animal = result
    })
  }

  createNew(): void {
    const dialogRef = this.dialog.open(CreateExperienceDialogComponent, {
      width: '400px',
      minHeight: '500px',
      disableClose: false,
      // data: { name: this.name, animal: this.animal },
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
      // this.animal = result
    })
  }

}
