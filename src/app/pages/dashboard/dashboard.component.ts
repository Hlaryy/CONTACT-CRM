import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { Category, Contact } from '../../models/crm.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private crmService = inject(CrmService);

  totalContacts: number = 0;
  totalFavorites: number = 0;
  totalCategories: number = 0;
  categoriesWithCount: { category: Category; count: number }[] = [];
  recentContacts: Contact[] = [];

  // Calcule toutes les statistiques du tableau de bord au chargement de la page
  ngOnInit(): void {
    const contacts = this.crmService.getContacts();
    const categories = this.crmService.getCategories();

    this.totalContacts = contacts.length;
    this.totalFavorites = contacts.filter(c => c.favorite).length;
    this.totalCategories = categories.length;

    // Associe chaque catégorie au nombre de contacts qu'elle contient
    this.categoriesWithCount = categories.map(cat => ({
      category: cat,
      count: contacts.filter(c => c.categoryId === cat.id).length
    }));

    // Trie les contacts du plus récent au plus ancien et garde les 5 premiers
    this.recentContacts = [...contacts]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5);
  }
}