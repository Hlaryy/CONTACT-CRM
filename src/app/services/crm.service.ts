import { Injectable } from '@angular/core';
import { Contact, Category } from '../models/crm.model';

@Injectable({
  providedIn: 'root'
})
class CrmService {
  private contactsKey = 'crm_contacts';
  private categoriesKey = 'crm_categories';

  constructor() {
    this.initDefaultData();
  }

  // Initialiser des données par défaut si le localStorage est vide
  private initDefaultData() {
    if (!localStorage.getItem(this.categoriesKey)) {
      const defaultCategories: Category[] = [
        { id: '1', name: 'Étudiants', color: '#3498db', createdAt: new Date().toISOString().split('T')[0] },
        { id: '2', name: 'Entreprises', color: '#2ecc71', createdAt: new Date().toISOString().split('T')[0] },
        { id: '3', name: 'Clients', color: '#e74c3c', createdAt: new Date().toISOString().split('T')[0] }
      ];
      localStorage.setItem(this.categoriesKey, JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem(this.contactsKey)) {
      localStorage.setItem(this.contactsKey, JSON.stringify([]));
    }
  }

  // --- GESTION DES CATÉGORIES ---
  // Fonction pour récupérer toutes les catégories
  getCategories(): Category[] {
    const data = localStorage.getItem(this.categoriesKey);
    return data ? JSON.parse(data) : [];
  }
  
  // Fonction pour ajouter une nouvelle catégorie
  addCategory(categoryData: Omit<Category, 'id' | 'createdAt'>) {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    categories.push(newCategory);
    localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
  }
  // Fonction pour supprimer une catégorie par son id
  deleteCategory(id: string): boolean {
    const contacts = this.getContacts();
    const isUsed = contacts.some(contact => contact.categoryId === id);
    
    // Bloquer la suppression si la catégorie est utilisée par un contact
    if (isUsed) {
      return false; 
    }

    let categories = this.getCategories();
    categories = categories.filter(cat => cat.id !== id);
    localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
    return true;
  }

  // --- GESTION DES CONTACTS ---
  // Fonction pour récupérer tous les contacts actuels
  getContacts(): Contact[] {
    const data = localStorage.getItem(this.contactsKey);
    return data ? JSON.parse(data) : [];
  }
  
  // Fonction pour ajouter un nouveau contact
  addContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) {
    const contacts = this.getContacts();
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    contacts.push(newContact);
    localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
  }
  
  // Fonction pour modifier un contact existant
  updateContact(id: string, contactData: Partial<Contact>) {
    let contacts = this.getContacts();
    contacts = contacts.map(contact => {
      if (contact.id === id) {
        return {
          ...contact,
          ...contactData,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return contact;
    });
    localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
  }
  
  // Fonction pour supprimer un contact
  deleteContact(id: string) {
    let contacts = this.getContacts();
    contacts = contacts.filter(contact => contact.id !== id);
    localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
  }
  
  // Fonction qui bascule l'état "favori" d'un contact
  toggleFavorite(id: string) {
    const contacts = this.getContacts();
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      this.updateContact(id, { favorite: !contact.favorite });
    }
  }
}

export { CrmService };