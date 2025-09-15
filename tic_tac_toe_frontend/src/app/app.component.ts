import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root application component that hosts the routed views.
 * Provides the global application layout including toolbar and footer.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // PUBLIC_INTERFACE
  /** Application title used in the header. */
  title = 'Tic Tac Toe';
}
