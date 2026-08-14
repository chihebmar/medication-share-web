import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/components/header/header.component';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  private readonly languageService = inject(LanguageService);

  constructor() {
    this.languageService.initialize();
  }
}