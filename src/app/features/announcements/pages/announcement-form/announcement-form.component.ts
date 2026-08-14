import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';
import {
  Gift,
  Search,
  Send,
  LucideAngularModule
} from 'lucide-angular';

import { Reference } from '../../../../core/models/reference.model';
import { AnnouncementService } from '../../../../core/services/announcement.service';
import { ReferenceService } from '../../../../core/services/reference.service';

@Component({
  selector: 'app-announcement-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    LucideAngularModule
  ],
  templateUrl: './announcement-form.component.html',
  styleUrl: './announcement-form.component.scss'
})
export class AnnouncementFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  readonly router = inject(Router);

  private readonly announcementService =
    inject(AnnouncementService);

  private readonly referenceService =
    inject(ReferenceService);

  readonly Gift = Gift;
  readonly Search = Search;
  readonly Send = Send;

  readonly governorates = signal<Reference[]>([]);
  readonly announcementTypes = signal<Reference[]>([]);

  readonly loading = signal(false);
  readonly loadingReferences = signal(true);

  readonly error = signal<string | null>(null);
  readonly success = signal(false);

  readonly form = this.fb.nonNullable.group({
    typeCode: [
      '',
      Validators.required
    ],

    medicationName: [
      '',
      [
        Validators.required,
        Validators.maxLength(150)
      ]
    ],

    governorateCode: [
      '',
      Validators.required
    ],

    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(30)
      ]
    ],

    description: [
      '',
      Validators.maxLength(1000)
    ]
  });

  ngOnInit(): void {
    this.loadReferences();
  }

  private loadReferences(): void {
    this.loadingReferences.set(true);

    this.referenceService
      .getByCategory('GOVERNORATE')
      .subscribe({
        next: (governorates) => {
          this.governorates.set(governorates);
          this.loadAnnouncementTypes();
        },
        error: (error) => {
          console.error(error);

          this.error.set(
            'Unable to load references'
          );

          this.loadingReferences.set(false);
        }
      });
  }

  private loadAnnouncementTypes(): void {
    this.referenceService
      .getByCategory('ANNOUNCEMENT_TYPE')
      .subscribe({
        next: (types) => {
          this.announcementTypes.set(types);
          this.loadingReferences.set(false);
        },
        error: (error) => {
          console.error(error);

          this.error.set(
            'Unable to load announcement types'
          );

          this.loadingReferences.set(false);
        }
      });
  }

  selectType(typeCode: string): void {
    this.form.controls.typeCode.setValue(typeCode);
  }

  submit(): void {
    this.error.set(null);
    this.success.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const value = this.form.getRawValue();

    this.announcementService
      .create({
        medicationName: value.medicationName.trim(),
        typeCode: value.typeCode,
        governorateCode: value.governorateCode,
        phoneNumber: value.phoneNumber.trim(),

        description:
          value.description.trim() || null,

        imageUrl: null
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(true);

          this.router.navigate([
            '/announcements'
          ]);
        },

        error: (error) => {
          console.error(error);

          this.loading.set(false);

          this.error.set(
            'Unable to create announcement'
          );
        }
      });
  }
}