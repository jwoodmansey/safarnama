import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TermsComponent>,
  ) { }

  ngOnInit(): void {
  }

  public close(): void {
    this.dialogRef.close()
  }
}
