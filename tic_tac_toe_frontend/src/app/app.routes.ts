import { Routes } from '@angular/router';
import { GameViewComponent } from './pages/game-view/game-view.component';

/**
 * Application routes.
 * Default route loads the Tic Tac Toe game page.
 */
export const routes: Routes = [
  { path: '', component: GameViewComponent },
  { path: '**', redirectTo: '' }
];
