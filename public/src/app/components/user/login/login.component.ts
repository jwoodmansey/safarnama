import { Component, OnInit } from '@angular/core'
import { MatDialogRef, MatDialog } from '@angular/material'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public dialog: MatDialog,
  )
  // @Inject(MAT_DIALOG_DATA) public data: DialogData)
  { }

  onNoClick(): void {
    // this.dialogRef.close()
  }
  ngOnInit(): void {
  }

}
