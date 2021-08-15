import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlaceType } from '@common/point-of-interest';
import { PlaceTypeService } from '@services/place-type.service';
import { FilePond } from 'filepond';
import { ICONS } from './icons';

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

  @ViewChild('myPond', { static: true }) myPond: FilePond

  pondFiles = []
  hasFile: boolean = false

  pondOptions = {
    class: 'my-filepond',
    multiple: false,
    storeAsFile: true,
    dropOnPage: true,
    dropOnElement: false,
    labelIdle: 'Drop png here, or click to upload',
    maxFileSize: '400KB',
    acceptedFileTypes: ['image/png'],
  }

  pondHandleInit(): void {
    console.log('FilePond has initialised', this.myPond)
  }

  pondHandleAddFile(event: any): void {
    console.log('A file was added', event)
    if (!event.error) {
      this.hasFile = true
    }
  }

  pondHandleProgress(event: any): void {
    console.log('A file progress changed', event)
    if (event.progress === 1) {
      this.hasFile = false
    }
  }

  pondHandleAbort(event: any): void {
    console.log('A file upload was aborted', event)
    this.hasFile = true
  }

  pondHandleError(event: any): void {
    console.log('A file upload has error', event)
    this.hasFile = false

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
    return this.form.valid && (this.selectedIcon !== undefined || this.hasFile)
  }

  close(): void {
    this.dialogRef.close()
  }

  uploadCustomIcon() {

  }

  submit(): void {
    console.log()
    if (this.isValid) {
      const file = this.myPond.getFiles()[0] as any
      this.placeTypeService.create({
        name: this.form.get('name').value,
        matIcon: this.selectedIcon,
        imageIconURL: file?.getFileEncodeBase64String(),
        _id: undefined,
        ownerId: undefined,
      }).subscribe(() => {
        this.dialogRef.close()
      })
    }
  }
}
