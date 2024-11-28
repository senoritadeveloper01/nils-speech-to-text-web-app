import { Injectable } from '@angular/core';
import { LocalSettingsKey } from '@shared/types/local-settings';

@Injectable({
  providedIn: 'root',
})
export class SpeechLanguageStorage {
  private language: string;

  constructor() {
    this.language = localStorage.getItem(LocalSettingsKey.SPEECH_LANG) || 'en-US';
  }

  getLanguage(): string {
    return this.language;
  }

  setLanguage(language: string): void {
    this.language = language;
    localStorage.setItem(LocalSettingsKey.SPEECH_LANG, language);
  }
}
