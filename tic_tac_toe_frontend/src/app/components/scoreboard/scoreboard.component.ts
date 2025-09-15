import { Component, computed, inject } from '@angular/core';
import { GameService } from '../../services/game.service';

/**
 * Scoreboard shows whose turn it is, outcome messages, and the cumulative scores.
 * Also hosts action buttons to reset the round or the entire match.
 */
@Component({
  selector: 'app-scoreboard',
  standalone: true,
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css'
})
export class ScoreboardComponent {
  private readonly game = inject(GameService);

  currentPlayer = this.game.currentPlayer;
  winner = this.game.winner;
  score = this.game.score;

  statusText = computed(() => {
    const w = this.winner();
    if (w === 'draw') return 'It’s a draw! 🤝';
    if (w === 'X') return 'Player X wins! 🏆';
    if (w === 'O') return 'Player O wins! 🏆';
    return `Player ${this.currentPlayer()} to move`;
  });

  // PUBLIC_INTERFACE
  /** Reset only the current round, keep cumulative score. */
  resetRound() {
    this.game.resetRound();
  }

  // PUBLIC_INTERFACE
  /** Reset the entire match including scores. */
  resetMatch() {
    this.game.resetMatch();
  }
}
