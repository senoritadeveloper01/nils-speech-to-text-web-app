import { ApplicationConfig, enableProdMode, inject, isDevMode, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslateService, MissingTranslationHandler, TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UnknownError } from '@service/translator/missing-translation-handler';
import { environment } from '@environments/environment';

if (environment.production) {
  enableProdMode();
}

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) => new TranslateHttpLoader(http, './i18n/', '.json');

export function loadTranslations(translateService: TranslateService): Promise<void> {
  const language = localStorage.getItem('ym@translate') || 'en';
  translateService.setDefaultLang(language);
  translateService.use(language);
  return new Promise<void>(resolve => {
    translateService.onLangChange.subscribe(() => {
      resolve();
    });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
    provideTranslateService({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: UnknownError,
      },
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    provideAppInitializer(() => loadTranslations(inject(TranslateService))),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Register the ServiceWorker as soon as the application is stable or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
