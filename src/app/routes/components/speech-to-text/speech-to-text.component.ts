import { Component, NgZone, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoggerService } from '@service/logger.service';
import { LanguageComponent } from '@shared/components/language/language.component';
import { SpeechLanguageComponent } from '@routes/components/speech-language/speech-language.component';
import { SpeechLanguageStorage } from '@storage/speech-language-storage';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@service/notification.service';

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrl: './speech-to-text.component.scss',
  standalone: true,
  imports: [CommonModule, TranslatePipe, LanguageComponent, SpeechLanguageComponent],
})
export class SpeechToTextComponent implements OnInit {
  public isListening = false;
  private speechRecognition: any = null;
  public transcript = '';

  constructor(
    private ngZone: NgZone,
    protected deviceDetectorService: DeviceDetectorService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private speechLanguageStorage: SpeechLanguageStorage
  ) {}

  ngOnInit(): void {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition ||
      (window as any).oSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      this.notificationService.showError(this.translateService.instant('ERR_SPEECH_RECOGNITION_NOT_SUPPORTED'));
    } else {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true; //TODO: NilS

      this.speechRecognition.lang = this.speechLanguageStorage.getLanguage();
      LoggerService.logInfo(['selectedLanguage', this.speechRecognition.lang]);

      this.speechRecognition.onstart = () => {
        LoggerService.logInfo(['onstart']);
        this.ngZone.run(() => {
          this.isListening = true;
        });
      };

      this.speechRecognition.onresult = (event: any) => {
        LoggerService.logInfo('onresult');
        const lastResult = event.results[event.results.length - 1][0].transcript;
        this.ngZone.run(() => {
          this.transcript = lastResult;
        });
      };

      this.speechRecognition.onerror = (event: any) => {
        this.notificationService.showError(this.translateService.instant('ERR_UNKNOWN_ERROR_HAS_OCCURED'));
        LoggerService.logError(`onerror: ${event.error}`);
        this.ngZone.run(() => {
          this.isListening = false;
        });
      };

      this.speechRecognition.onend = () => {
        LoggerService.logInfo('onend');
        this.ngZone.run(() => {
          this.isListening = false;
        });
      };
    }
  }

  startListening(): void {
    if (this.speechRecognition) {
      this.transcript = '';
      this.speechRecognition.start();
    }
  }

  stopListening(): void {
    this.speechRecognition.stop();
  }

  clearTranscript(): void {
    this.transcript = '';
  }
}
