import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  saveImagesToLocalStorage(data) {
    localStorage.setItem("imageData", JSON.stringify(data));
  }

  getImagesFromLocalStorage() {
    const existingData = JSON.parse(localStorage.getItem("imageData") || '[]');
    return existingData;
  }
}
