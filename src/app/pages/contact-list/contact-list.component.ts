import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { Category, Contact } from '../../models/crm.model';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  private crmService = inject(CrmService);

  allContacts: Contact[] = []; // Tableau qui conservera la liste complète et non filtrée de tous les contacts stockés
  filteredContacts: Contact[] = []; // Tableau qui contiendra uniquement les contacts filtrés et triés à afficher à l'écran
  categories: Category[] = []; // Tableau qui recevra toutes les catégories (pour le menu déroulant de filtre et les badges colorés)

  // Critères de recherche, filtrage et tri
  searchTerm: string = ''; // Stocke le texte tapé par l'utilisateur dans la barre de recherche
  selectedCategoryId: string = ''; // Stocke l'ID de la catégorie choisie dans le menu déroulant de filtre ('' signifie "Toutes les catégories")
  onlyFavorites: boolean = false; // Stocke l'état de la case à cocher "Favoris uniquement"
  sortBy: 'name' | 'recent' = 'name'; // Stocke le critère de tri actif, limité strictement aux deux valeurs 'name' ou 'recent'

  // Charge les contacts et les catégories au démarrage de la page
  ngOnInit(): void {
    this.loadData();
  }

  // Récupère les données depuis le service et applique les filtres actifs
  loadData(): void {
    this.allContacts = this.crmService.getContacts();
    this.categories = this.crmService.getCategories();
    this.applyFilters();
  }

  // Applique la recherche, les filtres et le tri sur la liste des contacts
  applyFilters(): void {
    let result = [...this.allContacts];

    // 1. Recherche texte (prénom, nom, email, entreprise)
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(c =>
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        (c.company && c.company.toLowerCase().includes(term))
      );
    }

    // 2. Filtre par catégorie
    if (this.selectedCategoryId !== '') {
      result = result.filter(c => c.categoryId === this.selectedCategoryId);
    }

    // 3. Filtre favoris uniquement
    if (this.onlyFavorites) {
      result = result.filter(c => c.favorite === true);
    }

    // 4. Tri
    if (this.sortBy === 'name') {
      result.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (this.sortBy === 'recent') {
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    this.filteredContacts = result;
  }

  // Retourne l'objet Category correspondant à un categoryId pour afficher son nom et sa couleur
  getCategory(categoryId: string): Category | undefined {
    return this.categories.find(cat => cat.id === categoryId);
  }

  // Bascule l'état favori d'un contact et rafraîchit l'affichage
  onToggleFavorite(id: string): void {
    this.crmService.toggleFavorite(id);
    this.loadData();
  }

  // Supprime un contact après confirmation et rafraîchit la liste
  onDelete(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce contact ?')) {
      this.crmService.deleteContact(id);
      this.loadData();
    }
  }
}