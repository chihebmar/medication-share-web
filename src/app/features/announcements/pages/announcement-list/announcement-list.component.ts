import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Search,
  Gift,
  LucideAngularModule,
  MapPin,
  SlidersHorizontal,
  Phone,
  CalendarDays,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';

import { Announcement } from '../../../../core/models/announcement.model';
import { AnnouncementService } from '../../../../core/services/announcement.service';
import { Reference } from '../../../../core/models/reference.model';
import { ReferenceService } from '../../../../core/services/reference.service';
import { DatePipe } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-announcement-list',
  imports: [LucideAngularModule, TranslatePipe, DatePipe],
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.scss',
})
export class AnnouncementListComponent implements OnInit {
  private readonly announcementService = inject(AnnouncementService);
  private readonly referenceService = inject(ReferenceService);
  private readonly searchSubject = new Subject<string>();

  readonly Search = Search;
  readonly Gift = Gift;
  readonly MapPin = MapPin;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly Phone = Phone;
  readonly CalendarDays = CalendarDays;
  readonly ArrowRight = ArrowRight;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  readonly searchTerm = signal('');
  readonly selectedGovernorate = signal('');

  readonly announcements = signal<Announcement[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mode = signal<'search' | 'give'>('search');
  readonly governorates = signal<Reference[]>([]);

  readonly currentPage = signal(0);
  readonly pageSize = signal(6);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.loadGovernorates();

    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(0);
      this.searchAnnouncements();
    });

    this.searchAnnouncements();
  }

  setMode(mode: 'search' | 'give'): void {
    this.mode.set(mode);
    this.currentPage.set(0);

    this.searchAnnouncements();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onGovernorateChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.selectedGovernorate.set(value);
    this.currentPage.set(0);

    this.searchAnnouncements();
  }

  searchAnnouncements(): void {
    const typeCode = this.mode() === 'search' ? 'ANNOUNCEMENT_OFFER' : 'ANNOUNCEMENT_REQUEST';

    this.loading.set(true);
    this.error.set(null);

    this.announcementService;
    this.announcementService
      .search(
        {
          medicationName: this.searchTerm().trim() || undefined,
          governorateCode: this.selectedGovernorate() || undefined,
          typeCode,
        },
        this.currentPage(),
        this.pageSize(),
      )
      .subscribe({
        next: (response) => {
          this.announcements.set(response.content);
          this.currentPage.set(response.page);
          this.totalElements.set(response.totalElements);
          this.totalPages.set(response.totalPages);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.error.set('Unable to load announcements');
          this.loading.set(false);
        },
      });
  }

  private loadGovernorates(): void {
    this.referenceService.getByCategory('GOVERNORATE').subscribe({
      next: (governorates) => {
        this.governorates.set(governorates);
      },
      error: (error) => {
        console.error('Unable to load governorates', error);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages() || page === this.currentPage()) {
      return;
    }

    this.currentPage.set(page);
    this.searchAnnouncements();
  }

  applySearch(): void {
    this.currentPage.set(0);
    this.searchAnnouncements();
  }
}
