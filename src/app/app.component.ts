import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatorService } from '@service/translator/translator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'nils-speech-to-text-web-app';

  constructor(private translateService: TranslatorService) {}

  ngOnInit() {
    this.translateService.setDefaultLanguage();
  }
}
