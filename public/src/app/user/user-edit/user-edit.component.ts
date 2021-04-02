import { Component, OnInit } from '@angular/core'
import { UserService } from '@services/user.service'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { PublicProfile } from '@common/experience'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {

  public profile: PublicProfile
  public profileForm: FormGroup = this.fb.group({
    bio: [''],
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe(user => {
      this.profile = user
      this.profileForm.get('bio').patchValue(user.bio)
    })
  }

  valid(): boolean {
    return this.profileForm.valid
  }

  async onSubmit(): Promise<void> {
    if (this.valid()) {
      const bio = this.profileForm.get('bio').value
      await this.userService.editProfile(this.profile.id, { bio })
      this.router.navigate(['/'])
      this.snackBar.open('Profile edited', undefined, { duration: 5000 })
    }
  }
}
