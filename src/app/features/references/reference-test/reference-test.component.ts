import { Component, inject, OnInit, signal } from '@angular/core';

import { Reference } from '../../../core/models/reference.model';
import { ReferenceService } from '../../../core/services/reference.service';

@Component({
  selector: 'app-reference-test',
  templateUrl: './reference-test.component.html',
  styleUrl: './reference-test.component.scss'
})
export class ReferenceTestComponent implements OnInit {

  private readonly referenceService = inject(ReferenceService);

  readonly governorates = signal<Reference[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.referenceService
      .getByCategory('GOVERNORATE')
      .subscribe({
        next: (references) => {
          this.governorates.set(references);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.error.set('Impossible de charger les gouvernorats.');
          this.loading.set(false);
        }
      });
  }
}