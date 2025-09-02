'use client';

import { useState } from 'react';
import { contacts } from '@/lib/data';
import type { Contact } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ContactListItem from '@/components/contact-list-item';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DigitalCard from '@/components/digital-card';

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Your Connections</h1>
        <p className="text-muted-foreground">Manage and view the contacts you've collected.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search contacts by name, company, or role..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((contact) => (
            <ContactListItem 
              key={contact.id} 
              contact={contact} 
              onViewCard={() => setSelectedContact(contact)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No contacts found for your search.</p>
        </div>
      )}

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-md p-0 border-none">
          {selectedContact && <DigitalCard user={selectedContact} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
