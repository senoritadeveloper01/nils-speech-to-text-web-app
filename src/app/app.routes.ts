import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'text-to-speech',
    loadComponent: () => import('@routes/components/speech-to-text/speech-to-text.component').then(m => m.SpeechToTextComponent),
  },
  { path: '**', redirectTo: 'text-to-speech' },
];
