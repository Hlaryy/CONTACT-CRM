import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { Category, Contact } from '../../models/crm.model';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private crmService = inject(CrmService);

  category: Category | undefined;
  contacts: Contact[] = [];
  
  /**
   * Initialise le composant en extrayant l'ID de la catégorie depuis l'URL,
   * puis charge la catégorie correspondante et filtre les contacts qui lui sont associés.
   */
  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.category = this.crmService.getCategories().find(c => c.id === categoryId);
      this.contacts = this.crmService.getContacts().filter(contact => contact.categoryId === categoryId);
    }
  }
}