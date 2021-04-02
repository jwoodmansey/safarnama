import { Component, OnInit } from '@angular/core'
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TermsComponent } from '../../../pages/terms/terms.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
  }

  openTerms(): void {
    this.dialog.open(TermsComponent, {
      width: '400px',
      minHeight: '500px',
      disableClose: false,
    })
  }
}
