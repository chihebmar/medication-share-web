import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Check, X, MapPin, Phone, CalendarDays, LucideAngularModule } from 'lucide-angular';

import { Announcement } from '../../../../core/models/announcement.model';
import { AnnouncementService } from '../../../../core/services/announcement.service';

@Component({
  selector: 'app-announcement-validation',
  imports: [DatePipe, TranslatePipe, LucideAngularModule],
  templateUrl: './announcement-validation.component.html',
  styleUrl: './announcement-validation.component.scss',
})
export class AnnouncementValidationComponent implements OnInit {
  private readonly announcementService = inject(AnnouncementService);

  readonly Check = Check;
  readonly X = X;
  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly CalendarDays = CalendarDays;

  readonly pendingAnnouncements = signal<Announcement[]>([]);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly currentPage = signal(0);
  readonly pageSize = signal(6);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly processingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadPendingAnnouncements();
  }

  loadPendingAnnouncements(): void {
    this.loading.set(true);
    this.error.set(null);

    this.announcementService.getPending({}, this.currentPage(), this.pageSize()).subscribe({
      next: (response) => {
        this.pendingAnnouncements.set(response.content);

        this.currentPage.set(response.page);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Unable to load pending announcements', error);

        this.error.set('Unable to load pending announcements');

        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages() || page === this.currentPage()) {
      return;
    }

    this.currentPage.set(page);
    this.loadPendingAnnouncements();
  }

  approveAnnouncement(id: number): void {
    if (this.processingId() !== null) {
      return;
    }

    this.processingId.set(id);
    this.error.set(null);

    this.announcementService.approve(id).subscribe({
      next: () => {
        this.processingId.set(null);
        this.reloadAfterAction();
      },
      error: (error) => {
        console.error('Unable to approve announcement', error);

        this.processingId.set(null);
        this.error.set('Unable to approve announcement');
      },
    });
  }

  rejectAnnouncement(id: number): void {
    if (this.processingId() !== null) {
      return;
    }

    this.processingId.set(id);
    this.error.set(null);

    this.announcementService.reject(id).subscribe({
      next: () => {
        this.processingId.set(null);
        this.reloadAfterAction();
      },
      error: (error) => {
        console.error('Unable to reject announcement', error);

        this.processingId.set(null);
        this.error.set('Unable to reject announcement');
      },
    });
  }

  private reloadAfterAction(): void {
    if (this.pendingAnnouncements().length === 1 && this.currentPage() > 0) {
      this.currentPage.update((page) => page - 1);
    }

    this.loadPendingAnnouncements();
  }
}
