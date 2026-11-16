import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { Category, Contact } from '../../models/crm.model';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private crmService = inject(CrmService);

  contact: Contact | undefined;
  category: Category | undefined;

  // Récupère l'ID du contact depuis l'URL et charge sa fiche ainsi que sa catégorie
  ngOnInit(): void {
    const contactId = this.route.snapshot.paramMap.get('id');
    if (contactId) {
      this.loadContact(contactId);
    }
  }

  // Charge les informations à jour du contact et de sa catégorie associée
  loadContact(id: string): void {
    this.contact = this.crmService.getContacts().find(c => c.id === id);
    if (this.contact) {
      this.category = this.crmService.getCategories().find(cat => cat.id === this.contact!.categoryId);
    }
  }

  // Bascule l'état favori du contact et rafraîchit l'affichage de la fiche
  onToggleFavorite(): void {
    if (this.contact) {
      this.crmService.toggleFavorite(this.contact.id);
      this.loadContact(this.contact.id);
    }
  }

  // Supprime le contact après confirmation puis redirige vers la liste des contacts
  onDelete(): void {
    if (this.contact && confirm('Voulez-vous vraiment supprimer ce contact ?')) {
      this.crmService.deleteContact(this.contact.id);
      this.router.navigate(['/contacts']);
    }
  }
}