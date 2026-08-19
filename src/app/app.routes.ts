import { Routes } from '@angular/router';

import { AnnouncementListComponent } from './features/announcements/pages/announcement-list/announcement-list.component';
import { AnnouncementFormComponent } from './features/announcements/pages/announcement-form/announcement-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'announcements',
    pathMatch: 'full'
  },
  {
    path: 'announcements',
    component: AnnouncementListComponent
  },
  {
    path: 'announcements/new',
    component: AnnouncementFormComponent
  },
  {
  path: 'announcements/validation',
  loadComponent: () =>
    import(
      './features/announcements/pages/announcement-validation/announcement-validation.component'
    ).then(
      m => m.AnnouncementValidationComponent
    )
}

];