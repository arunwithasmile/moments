import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatChipsModule } from '@angular/material/chips';
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Tag, TagList, TaggedImages } from '../../models/image/image.model';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UploadService } from '../../services/upload/upload.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-popup',
  standalone: true,
  imports: [
    MatInputModule,
    MatDialogActions,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatListModule,
    NgIf,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatChipsModule,
  ],
  templateUrl: './image-popup.component.html',
  styleUrl: './image-popup.component.css'
})
export class ImagePopupComponent {
  allTags = TagList;
  searchQuery: string = '';
  searchResults: Tag[];
  searchResultLength: number;
  savedTags: TaggedImages[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageId: number, imageUrl: string },
    private dialogRef: MatDialogRef<ImageUploadComponent>,
    private upload: UploadService,
    private zone: NgZone) { }

  get imageUrl(): string {
    return this.data.imageUrl;
  }

  ngOnInit(): void {
    this.getExistingData();
  }

  getExistingData() {
    this.savedTags = JSON.parse(localStorage.getItem("tags") || '[]').filter(t => t.tagImageId === this.data.imageId)
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  search() {
    this.getExistingData();
    console.log(this.savedTags, "taggedPeople", this.searchResults, this.allTags)
    if (this.savedTags.length == 0) {
      this.searchResults = this.allTags.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.searchResults = this.allTags;
      this.searchQuery = null;
      this.savedTags.forEach(tagElement => {
        this.searchResults = this.searchResults.filter(list =>
          list.name != tagElement.tagName
        )
      });
      console.log(this.searchResults);
    }
    this.searchResultLength = this.searchResults.length;
  }

  addTag(item: Tag) {
    let tagedImage = { tagImageId: this.data.imageId, tagName: item.name }
    this.upload.appendToLocalStorage("tags", tagedImage);
    this.savedTags.push(tagedImage);
    this.search();
  }

  removeTag(index: number) {
    this.savedTags.splice(index, 1);
    console.log(this.savedTags, index);
    localStorage.setItem('tags', JSON.stringify(this.savedTags));
  }
}
