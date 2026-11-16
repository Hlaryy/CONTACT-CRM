import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { Category, Contact } from '../../models/crm.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  private crmService = inject(CrmService);

  favoriteContacts: Contact[] = [];
  categories: Category[] = [];

  // Charge la liste des contacts favoris et les catégories au démarrage
  ngOnInit(): void {
    this.loadFavorites();
  }

  // Filtre uniquement les contacts ayant favorite === true
  loadFavorites(): void {
    this.favoriteContacts = this.crmService.getContacts().filter(c => c.favorite === true);
    this.categories = this.crmService.getCategories();
  }

  // Retrouve la catégorie d'un contact pour afficher son badge coloré
  getCategory(categoryId: string): Category | undefined {
    return this.categories.find(cat => cat.id === categoryId);
  }

  // Retire le contact des favoris et rafraîchit immédiatement la liste
  onRemoveFavorite(id: string): void {
    this.crmService.toggleFavorite(id);
    this.loadFavorites();
  }
}