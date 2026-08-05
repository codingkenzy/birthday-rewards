import { Routes } from '@angular/router';
import { Countdown } from './features/countdown/pages/countdown/countdown';
//import { Countdown } from './features/countdown/pages/countdown/countdown';
//import { Letter } from './features/letter/pages/letter/letter';

export const routes: Routes = [
  {
    path: '',
    component: Countdown
  }
];