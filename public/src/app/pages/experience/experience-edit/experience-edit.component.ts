import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ExperienceService } from '@services/experience.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-experience-edit',
  templateUrl: './experience-edit.component.html',
  styleUrls: ['./experience-edit.component.scss'],
})
export class ExperienceEditComponent implements OnInit {

  public editingId: string
  public experienceForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  })

  constructor(private fb: FormBuilder,
              private router: Router,
              private experienceService: ExperienceService) { }

  ngOnInit(): void {
    this.experienceService.getSelectedExperience().subscribe(exp => {
      this.experienceForm.get('name').patchValue(exp.name)
      this.editingId = exp._id
    })
  }

  valid(): boolean {
    return this.experienceForm.valid
  }

  onSubmit(): void {
    if (this.valid()) {
      const name = this.experienceForm.get('name').value
      this.experienceService.editExperience(this.editingId, name).subscribe(exp => {
        this.router.navigate(['/'])
      })
    }
  }
}
