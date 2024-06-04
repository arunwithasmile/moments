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
import { Tag, ImageData, availableTagList } from '../../models/image/image.model';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UploadService } from '../../services/upload/upload.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-popup',
  standalone: true,
  imports: [
    CommonModule,
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
  allImages: ImageData[];
  imageData: ImageData;
  allTags = availableTagList;
  searchQuery: string = '';
  searchResults: Tag[];
  searchResultLength: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageId: number, imageDataUrl: string },
    private dialogRef: MatDialogRef<ImageUploadComponent>,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    this.getExistingData();
  }

  getExistingData() {
    this.allImages = this.uploadService.getImagesFromLocalStorage();
    if (this.data.imageId >= 0) {
      this.imageData = this.allImages[this.data.imageId];
    } else {
      this.imageData = {
        imageId: this.allImages.length,
        dataURL: this.data.imageDataUrl,
        tags: []
      };
      this.allImages.push(this.imageData);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  search() {
    console.log(this.imageData.tags, "taggedPeople", this.searchResults, this.allTags)
    if (this.imageData.tags.length == 0) {
      this.searchResults = this.allTags.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.searchResults = this.allTags;
      this.searchQuery = null;
      this.imageData.tags.forEach(tagElement => {
        this.searchResults = this.searchResults.filter(list =>
          list.name != tagElement.name
        )
      });
      console.log(this.searchResults);
    }
    this.searchResultLength = this.searchResults.length;
  }

  addTag(tag: Tag) {
    this.imageData.tags.push(tag);
    this.search();
  }

  removeTag(index: number) {
    this.imageData.tags.splice(index, 1);
    console.log(this.imageData.tags, index);
  }

  upload() {
    this.uploadService.saveImagesToLocalStorage(this.allImages);
    this.closeDialog();
  }
}
