import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContactListComponent } from './pages/contact-list/contact-list.component';
import { ContactFormComponent } from './pages/contact-form/contact-form.component';
import { ContactDetailComponent } from './pages/contact-detail/contact-detail.component';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { CategoryFormComponent } from './pages/category-form/category-form.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { CategoryDetailComponent } from './pages/category-detail/category-detail.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'contacts', component: ContactListComponent },
  { path: 'contacts/new', component: ContactFormComponent },
  { path: 'contacts/:id', component: ContactDetailComponent },
  { path: 'contacts/:id/edit', component: ContactFormComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'categories/:id', component: CategoryDetailComponent },
  { path: '**', redirectTo: '' }
];