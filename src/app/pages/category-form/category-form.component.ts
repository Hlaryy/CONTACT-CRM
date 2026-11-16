import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CrmService } from '../../services/crm.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {
  private fb = inject(FormBuilder);
  private crmService = inject(CrmService);
  private router = inject(Router);

  categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    color: ['#3498db', Validators.required]
  });

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const { name, color } = this.categoryForm.value;
      this.crmService.addCategory({
        name: name!.trim(),
        color: color!
      });
      this.router.navigate(['/categories']);
    }
  }
}