import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { imageData } from '../../models/image/image.model';
import { UploadService } from '../../services/upload/upload.service';


@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [NgIf, NgFor, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent {
  loading: boolean = false;
  files: File[] = null;
  imageDataArray: imageData[];
  imgUploadLimit = 5;
  imgUploadCount = 0;
  completedCount: number;
  fileNames: string;

  constructor(private dialog: MatDialog, private upload: UploadService) { }

  ngOnInit(): void {
    this.refreshImages();
  }

  onChange(event) {
    this.files = Array.from(event.target.files);
    this.fileNames = this.files.map(f => f.name).join(', ');
    this.imgUploadCount = this.files.length;
    this.completedCount = 0;
  }

  onUpload() {
    this.loading = !this.loading;
    console.log(this.files);

    if (this.files && this.files.length) {
      this.files.forEach((file: File) => {
        this.readAndSaveFile(file);
      });
      this.loading = !this.loading;

    }
  }

  readAndSaveFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = reader.result as string;
      this.saveToLocalStorage(imageData);
      this.completedCount++;
      if (this.completedCount == this.imgUploadCount) {
        this.refreshImages();
        this.files = null;
        this.fileNames = null;
        this.imgUploadCount = 0;
      }
    };
    reader.readAsDataURL(file);
  }

  saveToLocalStorage(imageURL: string) {
    const existingData = JSON.parse(localStorage.getItem('imageData') || '[]');
    const imageData = { imageId: existingData.length, imageURL: imageURL }
    this.upload.appendToLocalStorage("imageData", imageData);
  }

  refreshImages() {
    this.imageDataArray = JSON.parse(localStorage.getItem('imageData') || '[]');
  }

  openImagePopup(imageId: number, imagePath: string): void {
    console.log("popup", imageId)
    this.dialog.open(ImagePopupComponent, {
      data: { imageId: imageId, imageUrl: imagePath },
      width: '50%',
      maxHeight: '80%',
    });
  }
}

