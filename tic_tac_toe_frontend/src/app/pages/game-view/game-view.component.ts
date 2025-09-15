import { Component } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';
import { ScoreboardComponent } from '../../components/scoreboard/scoreboard.component';

/**
 * GameView is the main routed page displaying the game board and the scoreboard.
 * Provides responsive layout and concise guidance for users.
 */
@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [BoardComponent, ScoreboardComponent],
  templateUrl: './game-view.component.html',
  styleUrl: './game-view.component.css'
})
export class GameViewComponent {}
