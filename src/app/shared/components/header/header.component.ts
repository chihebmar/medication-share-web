import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { HeartHandshake, Moon, PlusCircle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LucideAngularModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private readonly languageService = inject(LanguageService);

  readonly HeartHandshake = HeartHandshake;
  readonly Moon = Moon;
  readonly PlusCircle = PlusCircle;

  setLanguage(language: string): void {
    this.languageService.setLanguage(language);
  }

  get currentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }
}