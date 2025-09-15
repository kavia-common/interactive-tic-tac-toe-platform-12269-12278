import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import type { Cell } from '../../services/game.service';

/**
 * A single clickable Tic Tac Toe square.
 * Emits a click event when selected if empty.
 */
@Component({
  selector: 'app-square',
  standalone: true,
  templateUrl: './square.component.html',
  styleUrl: './square.component.css'
})
export class SquareComponent {
  /** Value to display: 'X', 'O' or null. */
  @Input() value: Cell = null;
  /** When true, the square is disabled (e.g., game over). */
  @Input() disabled = false;
  /** Fires when the user attempts to play this square. */
  @Output() pressed = new EventEmitter<void>();

  markClass = computed(() => {
    return this.value === 'X' ? 'mark-x' : this.value === 'O' ? 'mark-o' : '';
  });

  // PUBLIC_INTERFACE
  /** Handle a click and notify parent if allowed. */
  onClick(): void {
    if (!this.disabled && this.value === null) {
      this.pressed.emit();
    }
  }
}
