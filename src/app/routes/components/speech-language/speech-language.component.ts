import { Component } from '@angular/core';
import { LanguageConstants } from '@shared/model/language-constants';
import { SpeechLanguageStorage } from '@storage/speech-language-storage';

@Component({
  selector: 'app-speech-language',
  templateUrl: './speech-language.component.html',
  standalone: true,
  imports: [],
})
export class SpeechLanguageComponent {
  languages = LanguageConstants.LANGUAGES;

  constructor(protected speechLanguageStorage: SpeechLanguageStorage) {}

  setLanguage(value: string): void {
    this.speechLanguageStorage.setLanguage(value);
  }
}
