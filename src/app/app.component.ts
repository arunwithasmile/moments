import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageUploadComponent } from "./components/image-upload/image-upload.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, ImageUploadComponent]
})
export class AppComponent {
  title = 'Moments';
  tagline = 'Capture Life, Treasure Memories';
}
