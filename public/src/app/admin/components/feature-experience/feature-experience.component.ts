import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA
} from "@angular/material";
import { ExperienceData } from "@common/experience";
import { AdminService } from "app/admin/shared/services/admin.service";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-feature-experience",
  templateUrl: "./feature-experience.component.html",
  styleUrls: ["./feature-experience.component.scss"],
})
export class FeatureExperienceComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = ["Ports Past and Present", "Delhi"];

  @ViewChild("tagInput", {static: true}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto", {static: true}) matAutocomplete: MatAutocomplete;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public experience: ExperienceData,
    private snackBar: MatSnackBar
  ) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
  }
  ngOnInit(): void {}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our Tag
    if ((value || "").trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = "";
    this.tagCtrl.setValue(null);
  }

  submit() {
    this.adminService
      .setAsExperienceAsFeatured(this.experience._id, true, this.tags)
      .subscribe((res) => {
        this.snackBar.open(
          `${this.experience.name} is now a featured experience`,
          undefined,
          { duration: 5000 }
        );
        this.dialog.closeAll()
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(
      (tag) => tag.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
