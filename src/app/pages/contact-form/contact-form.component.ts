import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { Category } from '../../models/crm.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private crmService = inject(CrmService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories: Category[] = [];
  isEditMode: boolean = false;
  contactId: string | null = null;

  contactForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    company: [''],
    jobTitle: [''],
    categoryId: ['', Validators.required],
    notes: [''],
    favorite: [false]
  });

  // Charge les catégories et pré-remplit le formulaire si un ID est présent dans l'URL
  ngOnInit(): void {
    this.categories = this.crmService.getCategories();
    this.contactId = this.route.snapshot.paramMap.get('id');

    if (this.contactId) {
      this.isEditMode = true;
      const existingContact = this.crmService.getContacts().find(c => c.id === this.contactId);
      if (existingContact) {
        this.contactForm.patchValue(existingContact);
      } else {
        this.router.navigate(['/contacts']);
      }
    }
  }

  // Enregistre la création ou la modification du contact puis redirige vers la liste
  onSubmit(): void {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const contactPayload = {
        firstName: formValue.firstName!.trim(),
        lastName: formValue.lastName!.trim(),
        email: formValue.email!.trim(),
        phone: formValue.phone!.trim(),
        company: formValue.company?.trim() || '',
        jobTitle: formValue.jobTitle?.trim() || '',
        categoryId: formValue.categoryId!,
        notes: formValue.notes?.trim() || '',
        favorite: formValue.favorite ?? false
      };

      if (this.isEditMode && this.contactId) {
        this.crmService.updateContact(this.contactId, contactPayload);
      } else {
        this.crmService.addContact(contactPayload);
      }

      this.router.navigate(['/contacts']);
    }
  }
}