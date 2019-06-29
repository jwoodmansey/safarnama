import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material'
import { PlaceTypeService } from '@services/place-type.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ICONS } from './icons'
import { PlaceType } from '@common/point-of-interest'

@Component({
  selector: 'app-poi-type-library',
  templateUrl: './poi-type-library.component.html',
  styleUrls: ['./poi-type-library.component.scss'],
})
export class PoiTypeLibraryComponent implements OnInit {

  public form: FormGroup = this.fb.group(
    {
      name: ['', Validators.required],
      search: [''],
    })

  public readonly icons = ICONS

  public selectedIcon: string | undefined = undefined
  public filteredIcons: string[] = this.icons
  public types: PlaceType[]
  public loaded: boolean = false

  constructor(
    public dialogRef: MatDialogRef<PoiTypeLibraryComponent>,
    public dialog: MatDialog,
    public placeTypeService: PlaceTypeService,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.placeTypeService.getList().subscribe(types => {
      this.loaded = true
      this.types = types
    })
  }

  searchChange(newSearch: string): void {
    const trimmed = newSearch.toLowerCase().trim().replace(/ /g, '')
    console.log('search', trimmed)
    if (trimmed.length > 0) {
      this.filteredIcons = this.icons.filter(icon => icon.includes(trimmed))
    } else {
      this.filteredIcons = this.icons
    }
  }

  iconClicked(icon: string): void {
    this.selectedIcon = icon
  }

  get isValid(): boolean {
    return this.form.valid && this.selectedIcon !== undefined
  }

  close(): void {
    this.dialogRef.close()
  }

  submit(): void {
    if (this.isValid) {
      this.placeTypeService.create({
        name : this.form.get('name').value,
        matIcon: this.selectedIcon,
        _id: undefined,
      }).subscribe(() => {
        this.dialogRef.close()

      })
    }
  }
}
