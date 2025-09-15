import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Player = 'X' | 'O';
export type Cell = Player | null;

export interface Score {
  X: number;
  O: number;
  draws: number;
}

/**
 * Service managing Tic Tac Toe game state, rules, and scoreboard.
 * Uses Angular signals for efficient state updates.
 */
@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly platformId = inject(PLATFORM_ID);
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  /** 3x3 board represented as a flat array of 9 cells. */
  private readonly _board = signal<Cell[]>(Array(9).fill(null));
  /** Current player's turn. */
  private readonly _currentPlayer = signal<Player>('X');
  /** Winner of the current round, if any. 'draw' indicates stalemate. */
  private readonly _winner = signal<Player | 'draw' | null>(null);
  /** Scoreboard accumulated across rounds. */
  private readonly _score = signal<Score>(this.loadScore() ?? { X: 0, O: 0, draws: 0 });
  /** Flag indicating whether the current round is over. */
  private readonly _gameOver = signal<boolean>(false);

  // PUBLIC_INTERFACE
  /** Returns a readonly snapshot of the board state. */
  get board() { return this._board.asReadonly(); }

  // PUBLIC_INTERFACE
  /** Returns the current player signal. */
  get currentPlayer() { return this._currentPlayer.asReadonly(); }

  // PUBLIC_INTERFACE
  /** Returns the winner signal: 'X', 'O', 'draw', or null while playing. */
  get winner() { return this._winner.asReadonly(); }

  // PUBLIC_INTERFACE
  /** Returns the game over signal for the current round. */
  get gameOver() { return this._gameOver.asReadonly(); }

  // PUBLIC_INTERFACE
  /** Returns the scoreboard signal. */
  get score() { return this._score.asReadonly(); }

  // PUBLIC_INTERFACE
  /**
   * Attempts to make a move at the given index (0-8).
   * Ignores the action if the cell is occupied or the game is over.
   */
  makeMove(index: number): void {
    if (this._gameOver() || this._board()[index] !== null) return;
    const next = [...this._board()];
    next[index] = this._currentPlayer();
    this._board.set(next);

    const outcome = this.calculateWinner(next);
    if (outcome) {
      if (outcome === 'draw') {
        this._winner.set('draw');
        this._gameOver.set(true);
        this.updateScore({ draws: 1 });
      } else {
        this._winner.set(outcome);
        this._gameOver.set(true);
        this.updateScore(outcome === 'X' ? { X: 1 } : { O: 1 });
      }
      this.persistScore();
      return;
    }

    // Toggle player
    this._currentPlayer.set(this._currentPlayer() === 'X' ? 'O' : 'X');
  }

  // PUBLIC_INTERFACE
  /** Resets the current round while keeping the accumulated score. */
  resetRound(): void {
    this._board.set(Array(9).fill(null));
    this._currentPlayer.set('X');
    this._winner.set(null);
    this._gameOver.set(false);
  }

  // PUBLIC_INTERFACE
  /** Clears scoreboard and starts a fresh round. */
  resetMatch(): void {
    this._score.set({ X: 0, O: 0, draws: 0 });
    this.persistScore();
    this.resetRound();
  }

  /** Calculates the winner or returns null if game continues, 'draw' if stalemate. */
  private calculateWinner(b: Cell[]): Player | 'draw' | null {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diagonals
    ];
    for (const [a, c, d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return b[a];
      }
    }
    if (b.every(cell => cell !== null)) {
      return 'draw';
    }
    return null;
  }

  /** Adjust scoreboard incrementally. */
  private updateScore(delta: Partial<Score>) {
    const cur = this._score();
    this._score.set({
      X: cur.X + (delta.X ?? 0),
      O: cur.O + (delta.O ?? 0),
      draws: cur.draws + (delta.draws ?? 0),
    });
  }

  /** Load scoreboard from localStorage for persistence across reloads. */
  private loadScore(): Score | null {
    if (!this.isBrowser) return null;
    try {
      const raw = (globalThis as any)?.localStorage?.getItem('ttt_score');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Score;
      if (typeof parsed?.X === 'number' && typeof parsed?.O === 'number' && typeof parsed?.draws === 'number') {
        return parsed;
      }
    } catch {}
    return null;
  }

  /** Persist scoreboard to localStorage. */
  private persistScore(): void {
    if (!this.isBrowser) return;
    try {
      (globalThis as any)?.localStorage?.setItem('ttt_score', JSON.stringify(this._score()));
    } catch {}
  }
}
