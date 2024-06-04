import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImageData } from '../../models/image/image.model';
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
  imageDataArray: ImageData[];
  imgUploadLimit = 5;
  imgUploadCount = 0;
  completedCount: number;
  fileNames: string;

  constructor(private dialog: MatDialog, private uploadService: UploadService) { }

  ngOnInit(): void {
    this.refreshImages();
  }

  onChange(event) {
    this.readAndShowImage(event.target.files[0]);
  }

  readAndShowImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let imageDataUrl = reader.result as string;
      let openedDialog = this.dialog.open(ImagePopupComponent, {
        data: { imageDataUrl },
        width: '50%',
        maxHeight: '80%',
      })

      openedDialog.afterClosed().subscribe(() => {
        this.refreshImages();
      });
    };
    reader.readAsDataURL(file);
  }

  refreshImages() {
    this.imageDataArray = JSON.parse(localStorage.getItem('imageData') || '[]');
  }

  openImagePopup(imageId: number): void {
    console.log("popup", imageId)
    this.dialog.open(ImagePopupComponent, {
      data: { imageId: imageId },
      width: '50%',
      maxHeight: '80%',
    });
  }
}

