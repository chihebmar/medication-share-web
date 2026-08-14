import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly translate = inject(TranslateService);

  private readonly defaultLanguage = 'fr';

  initialize(): void {
    const savedLanguage =
      localStorage.getItem('language') ?? this.defaultLanguage;

    this.setLanguage(savedLanguage);
  }

  setLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('language', language);
  }

  getCurrentLanguage(): string {
    return this.translate.getCurrentLang()
      || this.defaultLanguage;
  }
}