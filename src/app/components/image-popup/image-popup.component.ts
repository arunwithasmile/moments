import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Tag, TagList, TaggedImages } from '../../models/image/image.model';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UploadService } from '../../services/upload/upload.service';

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
    MatOptionModule],
  templateUrl: './image-popup.component.html',
  styleUrl: './image-popup.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImagePopupComponent {
  items = TagList;
  searchQuery: string = '';
  searchResults: Tag[]
  tagedPeople: string[] = [];
  searchResultLength: number;
  arrayTag: TaggedImages[]

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageId: number, imageUrl: string },
    private dialogRef: MatDialogRef<ImageUploadComponent>,
    private upload: UploadService) { }

  get imageUrl(): string {
    return this.data.imageUrl;
  }

  ngOnInit(): void {
    this.arrayTag = JSON.parse(localStorage.getItem("tags"))
    console.log("Arrays", this.arrayTag)
    this.arrayTag.forEach(element => {
      if (element.tagImageId == this.data.imageId) {
        this.tagedPeople.push(element.tagName);
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  search() {
    this.searchResults = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.searchResultLength = this.searchResults.length;
  }

  addTag(item: Tag) {
    let flag = 0;
    console.log("item", item, this.data.imageId);
    let tagedImage = { tagImageId: this.data.imageId, tagName: item.name, imageURL: this.data.imageUrl }
    this.tagedPeople.forEach(element => {
      if (element == item.name) {
        flag = 1;
        alert("It's already tagged, please choose different name ")
      }
    })
    if (flag == 0) {
      this.upload.saveToLocalStorage("tags", tagedImage);
      this.tagedPeople.push(item.name)
      this.arrayTag = JSON.parse(localStorage.getItem("tags"))
    }
  }

  removeTag(index: number) {
    this.arrayTag.splice(index, 1);
    console.log(this.arrayTag, index)
    // Update Local Storage after deleting an item
    localStorage.setItem('tags', JSON.stringify(this.arrayTag));
    this.tagedPeople.pop()
  }
}
