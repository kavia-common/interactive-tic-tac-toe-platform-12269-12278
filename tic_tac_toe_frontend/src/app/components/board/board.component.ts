import { Component, effect, inject, signal } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { GameService } from '../../services/game.service';

/**
 * Board component rendering a 3x3 grid of squares.
 * Delegates game logic to GameService.
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SquareComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  private readonly game = inject(GameService);
  cells = this.game.board;

  /** Animation flag toggled briefly on move for subtle feedback. */
  bounce = signal<number | null>(null);

  constructor() {
    // Create a small visual cue when board changes
    effect(() => {
      const b = this.cells();
      const lastIndex = b.findIndex((v, i) => v !== null && this.prev()[i] === null);
      if (lastIndex >= 0) {
        this.bounce.set(lastIndex);
        // Use globalThis for universal environment safety and linter compliance
        const g: any = globalThis as any;
        if (g?.setTimeout) {
          g.setTimeout(() => this.bounce.set(null), 120);
        }
      }
      this.prev.set(b);
    });
  }

  private prev = signal<(string | null)[]>(Array(9).fill(null));

  // PUBLIC_INTERFACE
  /** Ask GameService to make a move at the given index. */
  play(index: number) {
    this.game.makeMove(index);
  }

  // PUBLIC_INTERFACE
  /** Whether the board should be disabled due to game over. */
  disabled(): boolean {
    return this.game.gameOver();
  }
}
