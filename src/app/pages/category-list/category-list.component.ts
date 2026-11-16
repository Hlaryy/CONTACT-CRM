import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { Category } from '../../models/crm.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  private crmService = inject(CrmService);
  categories: Category[] = [];
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories = this.crmService.getCategories();
  }

  onDelete(id: string): void {
    this.errorMessage = '';
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      const success = this.crmService.deleteCategory(id);
      if (success) {
        this.loadCategories();
      } else {
        this.errorMessage = 'Impossible de supprimer cette catégorie : elle est encore associée à un ou plusieurs contacts.';
      }
    }
  }
}