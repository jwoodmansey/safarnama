import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectData } from '@common/project';
import { ProjectService } from '@services/project.service';

@Component({
  selector: 'app-project-view-details',
  templateUrl: './project-view-details.component.html',
  styleUrls: ['./project-view-details.component.scss']
})
export class ProjectViewDetailsComponent implements OnInit {

  @Input()
  public project: ProjectData
  public form: FormGroup

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      description : [''],
      iOS: this.fb.group({
        appStoreId: [''],
        bundleId: [''],
      }),
      android: this.fb.group({
        package: ['']
      })
    })
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.form.setValue({
      iOS: {
        appStoreId: this.project.iOS?.appStoreId || '',
        bundleId: this.project.iOS?.bundleId || '',
      },
      android: {
        package: this.project.android?.package || ''
      },
      description: this.project.description || '',
    })
  }

  submit(): void {
    this.projectService.edit(this.project._id, this.form.getRawValue()).subscribe(() => {
      this.snackBar.open('Project edited')
    })
  }
}
